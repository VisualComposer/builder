<?php

namespace VisualComposer\Modules\System\Activation;

use VisualComposer\Helpers\WordPress\Options;
use VisualComposer\Framework\Container;

class Controller extends Container
{
    public function __construct()
    {
        register_activation_hook(
            VC_V_PLUGIN_FULL_PATH,
            function () {
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

    private function setVersion(Options $options)
    {
        $options->set('version', VC_V_VERSION);
    }
}
