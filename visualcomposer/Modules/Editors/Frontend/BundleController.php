<?php

namespace VisualComposer\Modules\Editors\Frontend;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Url;

/**
 * Class BundleController
 * @package VisualComposer\Modules\Editors\Frontend
 */
class BundleController extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    /**
     * BundleController constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\Editors\Frontend\BundleController::registerEditorAssets */
        $this->wpAddAction('init', 'registerEditorAssets', 10);

        /** @see \VisualComposer\Modules\Editors\Frontend\BundleController::addHeadBundleStyle */
        $this->addEvent('vcv:frontend:render', 'addHeadBundleStyle');

        /** @see \VisualComposer\Modules\Editors\Frontend\BundleController::addFooterBundleScript */
        $this->addEvent('vcv:frontend:render:footer vcv:frontend:postUpdate:render:footer', 'addFooterRuntimeScript');
    }

    /**
     * @param \VisualComposer\Helpers\Url $urlHelper
     */
    protected function registerEditorAssets(Url $urlHelper)
    {
        wp_register_style(
            'vcv:editors:frontend:style',
            $urlHelper->to('public/dist/wp.bundle.css'),
            [],
            VCV_VERSION
        );

        wp_register_style(
            'vcv:editors:frontend:vendor',
            $urlHelper->to('public/dist/vendor.bundle.css'),
            [],
            VCV_VERSION
        );
    }

    /**
     * Enqueue styles for frontend editor
     */
    protected function addHeadBundleStyle()
    {
        if (vcfilter('vcv:frontend:enqueue:bundle', true)) {
            wp_enqueue_style('vcv:editors:frontend:style');
            wp_enqueue_style('vcv:editors:frontend:vendor');
        }
    }

    /**
     * Add runtime script
     */
    protected function addFooterRuntimeScript()
    {
        wp_enqueue_script('vcv:assets:runtime:script');
    }
}
