<?php

namespace VisualComposer\Modules\License;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\License;
use VisualComposer\Helpers\Logger;
use VisualComposer\Helpers\Notice;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Class LicenseController
 * @package VisualComposer\Modules\License
 */
class LicenseController extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    /**
     * LicenseController constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\License\LicenseController::activate */
        $this->addFilter('vcv:ajax:license:activate:adminNonce', 'activate');

        /** @see \VisualComposer\Modules\License\LicenseController::refresh */
        $this->addFilter('vcv:ajax:license:refresh:adminNonce', 'refresh');

        /** @see \VisualComposer\Modules\License\LicenseController::unsetOptions */
        $this->addEvent('vcv:system:factory:reset', 'unsetOptions');

        // we use these server variables to check if user use our plugin in wordpress.com env
        if (defined('IS_ATOMIC') && IS_ATOMIC && defined('ATOMIC_CLIENT_ID') && '2' === ATOMIC_CLIENT_ID) {
            /** @see \VisualComposer\Modules\License\LicenseController::activateWpComSubscription */
            $this->wpAddAction('plugins_loaded', 'activateWpComSubscription');
        }
    }

    /**
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\Logger $loggerHelper
     * @param \VisualComposer\Helpers\License $licenseHelper
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return array|mixed|object
     */
    public function activate(
        Request $requestHelper,
        Logger $loggerHelper,
        License $licenseHelper,
        Options $optionsHelper
    ) {
        $licenseKey = $requestHelper->input('vcv-license-key');
        $body = [
            'url' => VCV_PLUGIN_URL,
            'license' => $licenseKey,
        ];

        if (defined('VCV_AUTHOR_API_KEY')) {
            $body['author_api_key'] = VCV_AUTHOR_API_KEY;
        }

        $url = vchelper('Url')->query(vcvenv('VCV_ACTIVATE_LICENSE_URL'), $body);

        $result = wp_remote_get(
            $url,
            [
                'timeout' => 30,
            ]
        );

        $resultBody = [];
        if (is_array($result) && isset($result['body'])) {
            $resultBody = json_decode($result['body'], true);
        }

        if ($resultBody && isset($resultBody['success'], $resultBody['error']) && !$resultBody['success']) {
            $code = $resultBody['error'];
            $message = $licenseHelper->licenseErrorCodes($code);
            $loggerHelper->log(
                $message,
                [
                    'result' => $body,
                ]
            );

            return ['status' => false, 'response' => $resultBody];
        }

        if (!vcIsBadResponse($resultBody)) {
            $licenseType = $resultBody['license_type'];
            if ($licenseType !== 'free') {
                $resultBody['license'] = $licenseKey;
                $this->setLicenseOptions($resultBody);

                $optionsHelper->deleteTransient('lastBundleUpdate');

                return ['status' => true];
            }

            $message = $licenseHelper->licenseErrorCodes('item_name_mismatch');
            $loggerHelper->log(
                $message,
                [
                    'result' => $body,
                ]
            );

            return ['status' => false, 'response' => $resultBody];
        }

        $loggerHelper->log(
            esc_html__('Failed to activate the license, try again.', 'visualcomposer'),
            [
                'result' => $body,
            ]
        );

        return ['status' => false];
    }

    /**
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\License $licenseHelper
     *
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return mixed
     */
    protected function refresh($response, $payload, License $licenseHelper, Options $optionsHelper)
    {
        $optionsHelper->deleteTransient('lastBundleUpdate');
        $optionsHelper->deleteTransient('elements:autoload:all');
        $optionsHelper->deleteTransient('addons:autoload:all');
        $optionsHelper->deleteTransient('vcv:wp-com:activation:request');
        $licenseHelper->refresh('vcv-license');

        wp_safe_redirect(admin_url('admin.php?page=vcv-license'));
        exit;
    }

    /**
     * @param \VisualComposer\Helpers\Options $optionsHelper
     * @param \VisualComposer\Helpers\Notice $noticeHelper
     *
     * @return bool
     */
    protected function unsetOptions(Options $optionsHelper, Notice $noticeHelper)
    {
        global $wpdb;
        $noticeHelper->removeNotice('premium:deactivated');
        $noticeHelper->removeNotice('license:expiration');

        $optionsHelper
            ->delete('siteRegistered')
            ->delete('siteId')
            ->delete('siteSecret')
            ->delete('siteAuthState')
            ->deleteTransient('siteAuthToken')
            ->deleteTransient('vcv:activation:request')
            ->deleteTransient('vcv:hub:action:request')
            ->deleteTransient('vcv:wp-com:activation:request')
            ->delete('siteAuthRefreshToken')
            ->delete('siteAuthTokenTtl')
            ->delete('lastBundleUpdate')
            ->delete('license-key')
            ->delete('license-type')
            ->delete('license-expiration')
            ->delete('license-key-token');

        // Remove old transients for activation request
        $wpdb->query(
            $wpdb->prepare(
                'DELETE FROM ' . $wpdb->options . ' WHERE option_name LIKE %s',
                '_transient_' . VCV_PREFIX . VCV_VERSION . 'vcv:wp-com:activation:request%'
            )
        );

        return true;
    }

    /**
     * Activate wordpress.com license subscription.
     */
    protected function activateWpComSubscription()
    {
        $licenseHelper = vchelper('License');

        if ($licenseHelper->isPremiumActivated()) {
            return;
        }
        $optionsHelper = vchelper('Options');

        $activeSubscriptions = get_option('wpcom_active_subscriptions', []);
        if (empty($activeSubscriptions)) {
            return;
        }
        $activeSubscriptionsChecksum = md5(wp_json_encode($activeSubscriptions));
        // if transient exists skip, so nothing changed in subscriptions
        if ($optionsHelper->getTransient('vcv:wp-com:activation:request:' . $activeSubscriptionsChecksum)) {
            return;
        }
        $blogId = null;
        if (class_exists('Jetpack_Options')) {
            $blogId = \Jetpack_Options::get_option('id');
        } else {
            return;
        }
        $optionsHelper->setTransient('vcv:wp-com:activation:request:' . $activeSubscriptionsChecksum, true, 600);

        $body = [
            'wp_com_subscription_activation_request' => 1,
            'blog-id' => $blogId,
        ];

        $url = vchelper('Url')->query(vcvenv('VCV_HUB_URL'), $body);

        $result = wp_remote_get(
            $url,
            [
                'timeout' => 30,
            ]
        );

        $resultBody = [];
        if (is_array($result) && isset($result['body'])) {
            $resultBody = json_decode($result['body'], true);
        }

        if (!vcIsBadResponse($resultBody)) {
            if (!empty($resultBody['data']['expiration'])) {
                $resultBody['data']['expires'] = $resultBody['data']['expiration'];
                unset($resultBody['data']['expiration']);
            }
            $this->setLicenseOptions($resultBody['data']);

            vchelper('Options')->deleteTransient('lastBundleUpdate');
        }
    }

    /**
     * Set license options.
     *
     * @param array $resultBody
     */
    protected function setLicenseOptions($resultBody)
    {
        $licenseHelper = vchelper('License');

        $licenseHelper->setKey($resultBody['license']);
        $licenseHelper->setType($resultBody['license_type']);
        $licenseHelper->setExpirationDate(
            $resultBody['expires'] !== 'lifetime' ? strtotime($resultBody['expires']) : 'lifetime'
        );
        $licenseHelper->updateUsageDate(true);
    }
}
