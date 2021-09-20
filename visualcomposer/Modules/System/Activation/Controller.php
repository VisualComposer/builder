<?php

namespace VisualComposer\Modules\System\Activation;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Class Controller.
 */
class Controller extends Container implements Module
{
    use WpFiltersActions;

    /**
     * Controller constructor.
     */
    public function __construct()
    {
        $file = plugin_basename(VCV_PLUGIN_FULL_PATH);
        // register_activation_hook
        /** @see \VisualComposer\Modules\System\Activation\Controller::activationHook */
        $this->wpAddAction(
            'activate_' . $file,
            'activationHook'
        );
        $this->wpAddAction(
            'deactivate_' . $file,
            'deactivationHook'
        );
    }

    /**
     * Trigger inner event on activation
     */
    protected function activationHook()
    {
        $optionsHelper = vchelper('Options');
        $optionsHelper->deleteTransient('lastBundleUpdate');
        $optionsHelper->deleteTransient('elements:autoload:all');
        $optionsHelper->deleteTransient('addons:autoload:all');
        vcevent('vcv:system:activation:hook');
    }

    /**
     * Trigger inner event on activation
     */
    protected function deactivationHook()
    {
        $optionsHelper = vchelper('Options');
        $optionsHelper->deleteTransient('lastBundleUpdate');
        $optionsHelper->deleteTransient('elements:autoload:all');
        $optionsHelper->deleteTransient('addons:autoload:all');
        vcevent('vcv:system:deactivation:hook');
    }
}
