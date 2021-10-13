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
        /** @see \VisualComposer\Modules\Editors\Frontend\BundleController::addFooterBundleScript */
        $this->addEvent('vcv:frontend:render:footer vcv:frontend:postUpdate:render:footer', 'addFooterRuntimeScript');
    }

    /**
     * Add runtime script
     */
    protected function addFooterRuntimeScript()
    {
        wp_enqueue_script('vcv:assets:runtime:script');
    }
}
