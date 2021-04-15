<?php

namespace VisualComposer\Modules\Vendors;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class ElementorController extends Container implements Module
{
    use WpFiltersActions;

    public function __construct()
    {
        $this->wpAddAction('elementor/common/after_register_scripts', 'dequeueScripts');
    }

    /**
     * Dequeue scripts in the VC editor to prevent finder opening on CMD+E || Ctrl+E
     */
    protected function dequeueScripts()
    {
        $frontendHelper = vchelper('Frontend');
        if (defined('ELEMENTOR_VERSION') && constant('ELEMENTOR_VERSION') && ($frontendHelper->isFrontend() || $frontendHelper->isPageEditable())) {
            // Dequeue and deregister elementor-dialog
            wp_dequeue_script('elementor-dialog');
            wp_deregister_script('elementor-dialog');

            // Dequeue and deregister elementor-frontend
            wp_dequeue_script('elementor-frontend');
            wp_deregister_script('elementor-frontend');

            // Dequeue and deregister elementor-common
            wp_dequeue_script('elementor-common');
            wp_deregister_script('elementor-common');
        }
    }
}
