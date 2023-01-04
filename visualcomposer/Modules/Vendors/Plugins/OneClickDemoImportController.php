<?php

namespace VisualComposer\Modules\Vendors\Plugins;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Backward compatibility with "One Click Demo Import" wordPress plugin.
 *
 * @see https://wordpress.org/plugins/one-click-demo-import/
 */
class OneClickDemoImportController extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;


    public function __construct()
    {
        $this->wpAddAction('plugins_loaded', 'initialize');
    }

    protected function initialize()
    {
        if (!class_exists('OCDI_Plugin')) {
            return;
        }

        /** @see \VisualComposer\Modules\Vendors\Plugins\OneClickDemoImportController::initAdmin */
        $this->addEvent('vcv:frontend:render', 'initAdmin');
    }

    /**
     * We need additional admin init to escape fatal error.
     */
    protected function initAdmin()
    {
        do_action('admin_init');
    }
}
