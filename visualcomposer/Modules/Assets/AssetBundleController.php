<?php

namespace VisualComposer\Modules\Assets;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Url;

/**
 * Class AssetBundleController
 * @package VisualComposer\Modules\Assets
 */
class AssetBundleController extends Container implements Module
{
    use WpFiltersActions;

    /**
     * AssetBundleController constructor.
     */
    public function __construct()
    {
        $this->wpAddAction('init', 'registerAssets');
    }

    /**
     * @param \VisualComposer\Helpers\Url $urlHelper
     */
    protected function registerAssets(Url $urlHelper)
    {
        wp_register_script(
            'vcv:assets:vendor:script',
            $urlHelper->to('public/dist/vendor.bundle.js'),
            [
                'jquery',
            ],
            VCV_VERSION,
            true
        );
        wp_register_script(
            'vcv:assets:front:script',
            $urlHelper->to('public/dist/front.bundle.js'),
            [
                'jquery',
            ],
            VCV_VERSION,
            true
        );
        wp_register_style(
            'vcv:assets:front:style',
            $urlHelper->to('public/dist/front.bundle.css'),
            [],
            VCV_VERSION
        );
        wp_register_script(
            'vcv:assets:runtime:script',
            $urlHelper->to('public/dist/runtime.bundle.js'),
            [
                'jquery',
            ],
            VCV_VERSION,
            true
        );
    }
}
