<?php

namespace VisualComposer\Modules\Assets;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Gzip;
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
    protected function registerAssets(Url $urlHelper, Gzip $gzipHelper)
    {
        $gzipPath = get_site_url(null, 'index.php?vcv-script=vendor');
        $normalPath = $urlHelper->to('public/dist/vendor.bundle.js');
        $path = $gzipHelper->isGzip() ? $gzipPath : $normalPath;
        wp_register_script(
            'vcv:assets:vendor:script',
            $path,
            [
                'jquery',
                'vcv:assets:runtime:script',
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
        wp_register_style(
            'vcv:wpVcSettings:style',
            $urlHelper->to('public/dist/wpVcSettings.bundle.css'),
            [],
            VCV_VERSION
        );
        wp_register_script(
            'vcv:wpVcSettings:script',
            $urlHelper->to('public/dist/wpVcSettings.bundle.js'),
            ['vcv:assets:vendor:script'],
            VCV_VERSION
        );
        wp_register_script(
            'vcv:wpUpdate:script',
            $urlHelper->to('public/dist/wpUpdate.bundle.js'),
            ['vcv:assets:vendor:script'],
            VCV_VERSION
        );
    }
}
