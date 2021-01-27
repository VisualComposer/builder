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

/**
 * Class LicenseController
 * @package VisualComposer\Modules\License
 */
class LicenseController extends Container implements Module
{
    use EventsFilters;

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
    }

    /**
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\Logger $loggerHelper
     * @param \VisualComposer\Helpers\License $licenseHelper
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return array|mixed|object
     */
    protected function activate(
        Request $requestHelper,
        Logger $loggerHelper,
        License $licenseHelper,
        Options $optionsHelper
    ) {
        $body = [
            'url' => VCV_PLUGIN_URL,
            'license' => $requestHelper->input('vcv-license-key'),
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
                $licenseHelper->setKey($requestHelper->input('vcv-license-key'));
                $licenseHelper->setType($licenseType);
                $licenseHelper->setExpirationDate(
                    $resultBody['expires'] !== 'lifetime' ? strtotime($resultBody['expires']) : 'lifetime'
                );
                $licenseHelper->updateUsageDate(true);
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
        $licenseHelper->refresh('vcv-license');

        wp_redirect(admin_url('admin.php?page=vcv-license'));
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
            ->delete('siteAuthRefreshToken')
            ->delete('siteAuthTokenTtl')
            ->delete('lastBundleUpdate')
            ->delete('license-key')
            ->delete('license-type')
            ->delete('license-expiration')
            ->delete('license-key-token');

        return true;
    }
}
