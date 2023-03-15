<?php

namespace VisualComposer\Modules\Vendors\Plugins;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Backward compatibility with "NextGEN Gallery" wordPress plugin.
 *
 * @see https://wordpress.org/plugins/nextgen-gallery/
 */
class NextGenController extends Container implements Module
{
    use WpFiltersActions;

    public function __construct()
    {
        $this->wpAddAction('plugins_loaded', 'initialize');
    }

    protected function initialize()
    {
        if (defined('NGG_PLUGIN_VERSION') && constant('NGG_PLUGIN_VERSION')) {
            $this->wpAddFilter('run_ngg_resource_manager', '__return_false');
        }
    }
}
