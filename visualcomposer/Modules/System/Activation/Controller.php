<?php

namespace VisualComposer\Modules\System\Activation;

use VisualComposer\Helpers\WordPress\Options;
use VisualComposer\Framework\Container;

/**
 * Class Controller
 * @package VisualComposer\Modules\System\Activation
 */
class Controller extends Container
{
    /**
     * Controller constructor.
     */
    public function __construct()
    {
        register_activation_hook(
            VC_V_PLUGIN_FULL_PATH,
            function () {
                /** @see \VisualComposer\Modules\System\Activation\Controller::setVersion */
                $this->call('setVersion');
            }
        );
        /*register_deactivation_hook(
            VC_V_PLUGIN_FULL_PATH,
            function () use ($event) {
                $event->fire('vc:system:activationController:deactivation');
            }
        );*/
    }

    /**
     * @param \VisualComposer\Helpers\WordPress\Options $options
     */
    private function setVersion(Options $options)
    {
        $options->set('version', VC_V_VERSION);
    }
}
