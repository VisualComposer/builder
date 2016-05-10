<?php

namespace VisualComposer\Modules\System\TextDomain;

use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Events;
use VisualComposer\Framework\Illuminate\Support\Module;

/**
 * Class Controller.
 */
class Controller extends Container /*implements Module*/
{
    /**
     * Controller constructor.
     *
     * @param \VisualComposer\Helpers\Events $eventHelper
     */
    public function __construct(Events $eventHelper)
    {
        $eventHelper->listen(
            'vcv:inited',
            function () {
                /** @see \VisualComposer\Modules\System\TextDomain\Controller::setDomain */
                $this->call('setDomain');
            }
        );
    }

    /**
     *
     */
    private function setDomain()
    {
        // TODO: Add languages.
        load_plugin_textdomain('vc5', false, VCV_PLUGIN_DIRNAME . '/languages');
    }
}
