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
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;

/**
 * Class DeactivationController
 * @package VisualComposer\Modules\License
 */
class DeactivationController extends Container implements Module
{
    use EventsFilters;

    /**
     * DeactivationController constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\License\DeactivationController::deactivate */
        $this->addFilter('vcv:ajax:license:deactivate:adminNonce', 'deactivate');
    }

    /**
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\License $licenseHelper
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @throws \Exception
     */
    protected function deactivate($response, $payload, License $licenseHelper, Options $optionsHelper)
    {
        if (vchelper('AccessCurrentUser')->wpAll('manage_options')->get()) {
            // data to send in our API request
            $params = [
                'edd_action' => 'deactivate_license',
                'license' => $licenseHelper->getKey(),
                'item_name' => 'Visual Composer',
                'url' => VCV_PLUGIN_URL,
            ];

            if (defined('VCV_AUTHOR_API_KEY') && $licenseHelper->isThemeActivated()) {
                $params['author_api_key'] = VCV_AUTHOR_API_KEY;
            }

            // Send the remote request
            wp_remote_post(
                vcvenv('VCV_HUB_URL'),
                [
                    'body' => $params,
                    'timeout' => 30,
                ]
            );

            // Despite of the response we still need to deactivate locally
            $licenseHelper->setKey('');
            $licenseHelper->setType('');
            $licenseHelper->setExpirationDate('');
            $optionsHelper->delete('license-usage');
            $optionsHelper->deleteTransient('lastBundleUpdate');

            wp_safe_redirect(admin_url('admin.php?page=vcv-getting-started'));
            vcvdie();
        }

        wp_safe_redirect(admin_url('admin.php?page=vcv-settings'));
        vcvdie();
    }
}
