<?php

namespace VisualComposer\Modules\System\Activation;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
use VisualComposer\Framework\Container;

/**
 * Class Controller
 */
class Controller extends Container implements Module
{
    /**
     * Controller constructor
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
     * @param \VisualComposer\Helpers\Options $options
     */
    public function setVersion(Options $options)
    {
        $options->set('version', VCV_VERSION);
    }
}
