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
            VCV_PLUGIN_FULL_PATH,
            function () {
                /** @see \VisualComposer\Modules\System\Activation\Controller::setVersion */
                $this->call('setVersion');
            }
        );
    }

    /**
     * @param \VisualComposer\Helpers\WordPress\Options $options
     */
    private function setVersion(Options $options)
    {
        $options->set('version', VCV_VERSION);
    }
}
