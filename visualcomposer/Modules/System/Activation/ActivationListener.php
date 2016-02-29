<?php

namespace VisualComposer\Modules\System\Activation;

use VisualComposer\Helpers\WordPress\Options;
use Illuminate\Contracts\Events\Dispatcher;
use VisualComposer\Modules\System\Container;

class ActivationListener extends Container
{
    public function __construct(Dispatcher $event)
    {
        $event->listen('vc:system:activationController:activation', function () {
            $this->call('setVersion');
        });
    }

    private function setVersion()
    {
        Options::set('version', VC_V_VERSION);
    }
}
