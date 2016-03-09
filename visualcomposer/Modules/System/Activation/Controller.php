<?php

namespace VisualComposer\Modules\System\Activation;

use Illuminate\Contracts\Events\Dispatcher;
use VisualComposer\Modules\System\Container;

class Controller extends Container
{
    /**
     * ActivationController constructor.
     *
     * @param \Illuminate\Contracts\Events\Dispatcher $event
     */
    public function __construct(Dispatcher $event)
    {
        register_activation_hook(
            VC_V_PLUGIN_FULL_PATH,
            function () use ($event) {
                $event->fire('vc:system:activationController:activation');
            }
        );
        register_deactivation_hook(
            VC_V_PLUGIN_FULL_PATH,
            function () use ($event) {
                $event->fire('vc:system:activationController:deactivation');
            }
        );
    }
}
