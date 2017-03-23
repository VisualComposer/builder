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
        /** @see \VisualComposer\Modules\Editors\Backend\AssetsController::enqueueEditorAssets */
        $this->wpAddAction('admin_enqueue_scripts', 'enqueueEditorAssets');
    }

    /**
     * @param \VisualComposer\Helpers\Frontend $frontendHelper
     */
    protected function enqueueEditorAssets(Frontend $frontendHelper)
    {
        global $post, $pagenow;
        if (empty($post)) {
            $post = get_post();
        }
        if (empty($post) || $pagenow == 'edit.php') {
            return;
        }
        if (!$frontendHelper->isFrontend()
            && vcfilter(
                'vcv:editors:backend:addMetabox',
                true,
                ['postType' => $post->post_type]
            )
        ) {
            $this->registerEditorAssets();
            $newWebpack = true;
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
    protected function registerEditorAssets()
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
