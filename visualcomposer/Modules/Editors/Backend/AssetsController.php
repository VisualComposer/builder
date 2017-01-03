<?php

namespace VisualComposer\Modules\Editors\Backend;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class AssetsController extends Container implements Module
{
    use WpFiltersActions;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Editors\Backend\AssetsController::enqueueEditorAssets */
        $this->wpAddAction('admin_enqueue_scripts', 'enqueueEditorAssets');
    }

    private function enqueueEditorAssets()
    {
        $this->registerEditorAssets();
        $newWebpack = false;
        if ($newWebpack) {
            wp_enqueue_script('vcv:editors:backend:vendor');
        }

        wp_enqueue_script('vcv:editors:backend:bundle');
        wp_enqueue_style('vcv:editors:backend:bundle');
    }

    private function registerEditorAssets()
    {
        $urlHelper = vchelper('Url');
        $bundleJsUrl = $urlHelper->to('public/dist/backend.bundle.js?' . uniqid());
        $bundleCssUrl = $urlHelper->to('public/dist/backend.bundle.css?' . uniqid());
        wp_register_script('vcv:editors:backend:bundle', $bundleJsUrl);
        wp_register_style('vcv:editors:backend:bundle', $bundleCssUrl);

        $vendorJsUrl = $urlHelper->to('public/dist/vendor.bundle.js?' . uniqid());
        wp_register_script('vcv:editors:backend:vendor', $vendorJsUrl);
    }
}
