<?php

namespace VisualComposer\Modules\License;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Access\CurrentUser;
use VisualComposer\Helpers\License;
use VisualComposer\Helpers\Logger;
use VisualComposer\Helpers\Notice;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Token;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Class LicenseController
 * @package VisualComposer\Modules\Account
 */
class LicenseController extends Container implements Module
{
    use EventsFilters;

    /**
     * Receive licence key and store it in DB
     *
     * @param $response
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\Access\CurrentUser $currentUserHelper
     * @param \VisualComposer\Helpers\License $licenseHelper
     * @param \VisualComposer\Helpers\Logger $loggerHelper
     * @param \VisualComposer\Helpers\Notice $noticeHelper
     * @param Token $tokenHelper
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return bool|void
     */
    protected function getLicenseKey(
        $response,
        Request $requestHelper,
        CurrentUser $currentUserHelper,
        License $licenseHelper,
        Logger $loggerHelper,
        Notice $noticeHelper,
        Token $tokenHelper,
        Options $optionsHelper
    ) {
        if (!$currentUserHelper->wpAll('manage_options')->get()) {
            return $response;
        }

        if ($requestHelper->input('activate')) {
            $token = $requestHelper->input('activate');

            if ($licenseHelper->isValidToken($token)) {
                $body = [
                    'token' => $licenseHelper->getKeyToken(),
                    'id' => get_site_url(),
                    'hoster_id' => vcvenv('VCV_ENV_ADDONS_ID'),
                    'domain' => get_site_url(),
                    'url' => VCV_PLUGIN_URL,
                ];
                $url = VCV_LICENSE_ACTIVATE_FINISH_URL;
                $url = vchelper('Url')->query($url, $body);

                $result = wp_remote_get(
                    $url,
                    [
                        'timeout' => 30,
                    ]
                );

                if (!vcIsBadResponse($result)) {
                    $result = json_decode($result['body'], true);
                    $licenseHelper->setKey($result['license_key']);
                    if (isset($result['auth_token'])) {
                        $tokenHelper->setToken($result['auth_token']);
                    }
                    $noticeHelper->removeNotice('premium:deactivated');
                    $optionsHelper->deleteTransient('lastBundleUpdate');
                    if (vcvenv('VCV_FT_ACTIVATION_REDESIGN')) {
                        wp_redirect(admin_url('admin.php?page=vcv-update'));
                    } else {
                        wp_redirect(admin_url('admin.php?page=vcv-upgrade'));
                    }
                    exit;
                } else {
                    $loggerHelper->logNotice('activation:failed', __('License activation failed', 'vcwb'));
                }
            } else {
                $loggerHelper->logNotice(
                    'activation:failed',
                    __('Invalid token -> Failed licence activation - Invalid token', 'vcwb')
                );
            }
        }

        wp_redirect(admin_url('index.php'));
        exit;
    }

    use WpFiltersActions;

    /**
     * LicenseController constructor.
     */
    public function __construct()
    {
        $this->addFilter('vcv:ajax:license:activate:adminNonce', 'getLicenseKey');
        $this->addFilter('vcv:ajax:license:deactivate:adminNonce', 'unsetLicenseKey');
        $this->addEvent('vcv:system:factory:reset', 'unsetOptions');
    }

    /**
     * Receive licence key and store it in DB
     *
     * @param $response
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\Access\CurrentUser $currentUserHelper
     * @param \VisualComposer\Helpers\License $licenseHelper
     * @param \VisualComposer\Helpers\Logger $loggerHelper
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return bool|void
     */
    protected function unsetLicenseKey(
        $response,
        Request $requestHelper,
        CurrentUser $currentUserHelper,
        License $licenseHelper,
        Logger $loggerHelper,
        Options $optionsHelper
    ) {
        if (!$currentUserHelper->wpAll('manage_options')->get()) {
            return $response;
        }

        if ($requestHelper->input('deactivate')) {
            $token = $requestHelper->input('deactivate');

            if ($licenseHelper->isValidToken($token)) {
                $body = [
                    'token' => $licenseHelper->getKeyToken(),
                    'url' => VCV_PLUGIN_URL,
                    'domain' => get_site_url(),
                ];

                $url = VCV_LICENSE_DEACTIVATE_FINISH_URL;
                $url = vchelper('Url')->query($url, $body);

                $result = wp_remote_get(
                    $url,
                    [
                        'timeout' => 30,
                    ]
                );

                if (!vcIsBadResponse($result)) {
                    // $result = json_decode($result['body'], true);
                    $licenseHelper->setKey('');
                    $licenseHelper->setKeyToken('');
                    $optionsHelper->deleteTransient('lastBundleUpdate');
                    wp_redirect(admin_url('index.php'));
                    exit;
                } else {
                    $loggerHelper->log(
                        __('Failed licence de-activation', 'vcwb') . ' #10070',
                        [
                            'response' => is_wp_error($result) ? $result->get_error_message()
                                : (is_array($result) && isset($result['body']) ? $result['body'] : ''),
                        ]
                    );
                }
            } else {
                $loggerHelper->log(
                    __('Invalid license deactivation token', 'vcwb') . ' #10071',
                    [
                        'token' => $token,
                    ]
                );
            }
        }

        return false;
    }

    protected function unsetOptions(Options $optionsHelper)
    {
        $optionsHelper
            ->delete('license-key-token')
            ->delete('siteRegistered')
            ->delete('license-key');
    }
}
