<?php

namespace VisualComposer\Modules\System\Activation;

//use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Class Controller.
 */
class Controller extends Container /*implements Module*/
{
    use WpFiltersActions;

    /**
     * Controller constructor.
     */
    public function __construct()
    {
        $file = plugin_basename(VCV_PLUGIN_FULL_PATH);
        // register_activation_hook
        /** @see \VisualComposer\Modules\System\Activation\Controller::setVersion */
        $this->wpAddAction(
            'activate_' . $file,
            'setVersion'
        );
    }

    /**
     * @param \VisualComposer\Helpers\Options $options
     */
    private function setVersion(Options $options)
    {
        $options->set('version', VCV_VERSION);
    }
}
