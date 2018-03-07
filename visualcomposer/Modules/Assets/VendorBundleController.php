<?php

namespace VisualComposer\Modules\Assets;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Assets;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Url;
use VisualComposer\Helpers\Token;

class VendorBundleController extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    public function __construct(Token $tokenHelper)
    {
        /** @see \VisualComposer\Modules\Assets\VendorBundleController::addVendorScript */
        $this->addFilter(
            'vcv:backend:extraOutput vcv:frontend:head:extraOutput',
            'addVendorScript',
            1
        );
        $this->wpAddAction('init', 'registerVendorScripts');
        $this->wpAddAction('wp_enqueue_scripts', 'enqueueVendorScripts', 1);
        $this->wpAddAction('wp_enqueue_scripts', 'enqueueFrontScripts', 2);
        $this->wpAddAction('admin_enqueue_scripts', 'enqueueJquery');
    }

    protected function registerVendorScripts(Url $urlHelper, Assets $assetsHelper)
    {
        wp_register_script(
            'vcv:assets:vendor:script',
            vcvenv('VCV_ENV_EXTENSION_DOWNLOAD')
                ?
                $assetsHelper->getAssetUrl('/editor/vendor.bundle.js')
                :
                $urlHelper->to('public/dist/vendor.bundle.js'),
            [
                'jquery',
            ],
            VCV_VERSION,
            true
        );
        wp_register_script(
            'vcv:assets:front:script',
            vcvenv('VCV_ENV_EXTENSION_DOWNLOAD')
                ?
                $assetsHelper->getAssetUrl('/editor/front.bundle.js')
                :
                $urlHelper->to('public/dist/front.bundle.js'),
            [
                'vcv:assets:vendor:script',
            ],
            VCV_VERSION,
            true
        );
        wp_register_style(
            'vcv:assets:front:style',
            vcvenv('VCV_ENV_EXTENSION_DOWNLOAD')
                ?
                $assetsHelper->getAssetUrl('/editor/front.bundle.css')
                :
                $urlHelper->to('public/dist/front.bundle.css'),
            [],
            VCV_VERSION
        );
    }

    protected function addVendorScript($response, $payload, Url $urlHelper, Assets $assetsHelper)
    {
        // Add Vendor JS
        $response = array_merge(
            (array)$response,
            [
                sprintf(
                    '<script id="vcv-script-vendor-bundle" type="text/javascript" src="%s"></script>',
                    vcvenv('VCV_ENV_EXTENSION_DOWNLOAD')
                        ?
                        $assetsHelper->getAssetUrl('/editor/vendor.bundle.js?v=' . VCV_VERSION)
                        :
                        $urlHelper->to('public/dist/vendor.bundle.js?v=' . VCV_VERSION)
                ),
            ]
        );

        return $response;
    }

    protected function enqueueVendorScripts()
    {
        wp_enqueue_script('jquery'); // Required for 3-rd elements libraries
        wp_enqueue_script('vcv:assets:vendor:script');
    }

    protected function enqueueFrontScripts()
    {
        wp_enqueue_style('vcv:assets:front:style');
        wp_enqueue_script('vcv:assets:front:script');
    }

    protected function enqueueJquery()
    {
        // About, Activation, FE-Update, BE-Update pages
        wp_enqueue_script('jquery'); // Required for 3-rd elements libraries
    }
}
