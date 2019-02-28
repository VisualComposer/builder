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
use VisualComposer\Helpers\Notice;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Token;
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
     * @param \VisualComposer\Helpers\Notice $noticeHelper
     * @param Token $tokenHelper
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return mixed
     */
    protected function getLicenseKey(
        $response,
        Request $requestHelper,
        CurrentUser $currentUserHelper,
        License $licenseHelper,
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
                if ($requestHelper->exists('type') && $requestHelper->input('type') === 'free') {
                    $tokenHelper->setSiteAuthorized();
                    $optionsHelper->deleteTransient('lastBundleUpdate');
                    wp_redirect(admin_url('admin.php?page=vcv-update'));
                    exit;
                } else {
                    $body = [
                        'token' => $licenseHelper->getKeyToken(),
                        'id' => get_site_url(),
                        'hoster_id' => vcvenv('VCV_ENV_ADDONS_ID'),
                        'domain' => get_site_url(),
                        'url' => VCV_PLUGIN_URL,
                    ];
                    $url = vcvenv('VCV_LICENSE_ACTIVATE_FINISH_URL');
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
                        $tokenHelper->setSiteAuthorized();
                        $noticeHelper->removeNotice('premium:deactivated');
                        $optionsHelper->deleteTransient('lastBundleUpdate');
                        wp_redirect(admin_url('admin.php?page=vcv-update'));
                        exit;
                    }
                }
            } else {
                $noticeHelper->addNotice(
                    'activation:failed',
                    // TODO: Error texts
                    __('Invalid token -> Failed licence activation - Invalid token', 'vcwb')
                );
            }
        }

        wp_redirect(admin_url('index.php'));
        exit;
    }

    /**
     * Receive licence key and store it in DB
     *
     * @param $response
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\Access\CurrentUser $currentUserHelper
     * @param \VisualComposer\Helpers\License $licenseHelper
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return mixed
     */
    protected function unsetLicenseKey(
        $response,
        Request $requestHelper,
        CurrentUser $currentUserHelper,
        License $licenseHelper,
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

                $url = vcvenv('VCV_LICENSE_DEACTIVATE_FINISH_URL');
                $url = vchelper('Url')->query($url, $body);

                $result = wp_remote_get(
                    $url,
                    [
                        'timeout' => 30,
                    ]
                );

                if (!vcIsBadResponse($result)) {
                    $licenseHelper->setKey('');
                    $licenseHelper->setKeyToken('');
                    $optionsHelper->deleteTransient('lastBundleUpdate');
                    wp_redirect(admin_url('index.php'));
                    exit;
                }
            }
        }

        wp_redirect(admin_url('index.php'));
        exit;
    }

    protected function unsetOptions(Options $optionsHelper)
    {
        $optionsHelper
            ->delete('license-key-token')
            ->delete('siteRegistered')
            ->delete('license-key');
    }
}
