<?php

namespace VisualComposer\Modules\Account;

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
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Token;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Modules\Settings\Pages\Premium;

/**
 * Class LicenseController
 * @package VisualComposer\Modules\Account
 */
class LicenseController extends Container implements Module
{
    use EventsFilters;

    /**
     * LicenseController constructor.
     */
    public function __construct()
    {
        // TODO: vcv:system:deactivation:hook
        $this->addFilter('vcv:ajax:license:activate:adminNonce', 'getLicenseKey');
        $this->addFilter('vcv:ajax:license:deactivate:adminNonce', 'unsetLicenseKey');
        $this->addEvent('vcv:system:factory:reset', 'unsetOptions');
    }

    /**
     * Receive licence key and store it in DB
     *
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\Access\CurrentUser $currentUserHelper
     * @param \VisualComposer\Helpers\License $licenseHelper
     * @param \VisualComposer\Helpers\Token $tokenHelper
     * @param \VisualComposer\Helpers\Logger $loggerHelper
     *
     * @return bool|void
     */
    protected function getLicenseKey(
        Request $requestHelper,
        CurrentUser $currentUserHelper,
        License $licenseHelper,
        Token $tokenHelper,
        Logger $loggerHelper,
        Options $optionsHelper,
        Premium $premiumPageModule
    ) {
        if (!$currentUserHelper->wpAll('manage_options')->get()) {
            return;
        }

        if ($requestHelper->input('activate')) {
            $token = $requestHelper->input('activate');

            if ($licenseHelper->isValidToken($token)) {
                $result = wp_remote_get(
                    VCV_LICENSE_ACTIVATE_FINISH_URL,
                    [
                        'timeout' => 10 ,
                        'body' => [
                            'token' => $licenseHelper->getKeyToken(),
                        ],
                    ]
                );

                if (!vcIsBadResponse($result)) {
                    $result = json_decode($result['body'], true);
                    $licenseHelper->setKey($result['license_key']);
                    wp_redirect(admin_url('admin.php?page=' . $premiumPageModule->getSlug()));
                    exit;
                } else {
                    $loggerHelper->log(
                        __('Failed to finish licence activation', 'vcwb'),
                        [
                            'response' => is_wp_error($result) ? $result->get_error_message()
                                : (is_array($result) ? $result['body'] : ''),
                        ]
                    );
                }
            } else {
                $loggerHelper->log(
                    __('Invalid token', 'vcwb'),
                    [
                        'token' => $token,
                    ]
                );
            }
        }

        return false;
    }
    /**
     * Receive licence key and store it in DB
     *
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\Access\CurrentUser $currentUserHelper
     * @param \VisualComposer\Helpers\License $licenseHelper
     * @param \VisualComposer\Helpers\Token $tokenHelper
     * @param \VisualComposer\Helpers\Logger $loggerHelper
     *
     * @return bool|void
     */
    protected function unsetLicenseKey(
        Request $requestHelper,
        CurrentUser $currentUserHelper,
        License $licenseHelper,
        Token $tokenHelper,
        Logger $loggerHelper,
        Options $optionsHelper,
        Premium $premiumPageModule
    ) {
        if (!$currentUserHelper->wpAll('manage_options')->get()) {
            return;
        }

        if ($requestHelper->input('deactivate')) {
            $token = $requestHelper->input('deactivate');

            if ($licenseHelper->isValidToken($token)) {
                $result = wp_remote_get(
                    VCV_LICENSE_DEACTIVATE_FINISH_URL,
                    [
                        'timeout' => 10,
                        'body' => [
                            'token' => $licenseHelper->getKeyToken(),
                        ],
                    ]
                );

                if (!vcIsBadResponse($result)) {
                    $result = json_decode($result['body'], true);
                    $licenseHelper->setKey('');
                    wp_redirect(admin_url('admin.php?page=' . $premiumPageModule->getSlug()));
                    exit;
                } else {
                    $loggerHelper->log(
                        __('Failed to finish licence de-activation', 'vcwb'),
                        [
                            'response' => is_wp_error($result) ? $result->get_error_message()
                                : (is_array($result) ? $result['body'] : ''),
                        ]
                    );
                }
            } else {
                $loggerHelper->log(
                    __('Invalid token', 'vcwb'),
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
