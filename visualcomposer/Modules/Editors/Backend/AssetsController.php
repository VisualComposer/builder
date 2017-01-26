<?php

namespace VisualComposer\Modules\Editors\Backend;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Frontend;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Class AssetsController
 * @package VisualComposer\Modules\Editors\Backend
 */
class AssetsController extends Container implements Module
{
    use WpFiltersActions;

    /**
     * AssetsController constructor.
     *
     * @param \VisualComposer\Helpers\Request $request
     */
    public function __construct(Request $request)
    {
        $toggleFeatureBackend = false;
        if ($toggleFeatureBackend && !$request->exists('vcv-disable')) {
            /** @see \VisualComposer\Modules\Editors\Backend\AssetsController::enqueueEditorAssets */
            $this->wpAddAction('admin_enqueue_scripts', 'enqueueEditorAssets');
        }
    }

    /**
     * @param \VisualComposer\Helpers\Frontend $frontendHelper
     */
    private function enqueueEditorAssets(Frontend $frontendHelper)
    {
        if (!$frontendHelper->isFrontend()) {
            $this->registerEditorAssets();
            $newWebpack = false;
            if ($newWebpack) {
                wp_enqueue_script('vcv:editors:backend:vendor');
            }

            wp_enqueue_script('vcv:editors:backend:bundle');
            wp_enqueue_style('vcv:editors:backend:bundle');
        }
    }

    /**
     *
     */
    private function registerEditorAssets()
    {
        $urlHelper = vchelper('Url');
        $bundleJsUrl = $urlHelper->to('public/dist/wpbackend.bundle.js?' . uniqid());
        $bundleCssUrl = $urlHelper->to('public/dist/wpbackend.bundle.css?' . uniqid());
        wp_register_script('vcv:editors:backend:bundle', $bundleJsUrl);
        wp_register_style('vcv:editors:backend:bundle', $bundleCssUrl);

        $vendorJsUrl = $urlHelper->to('public/dist/vendor.bundle.js?' . uniqid());
        wp_register_script('vcv:editors:backend:vendor', $vendorJsUrl);
    }
}
