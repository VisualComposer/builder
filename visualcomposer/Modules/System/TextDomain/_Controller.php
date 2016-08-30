<?php

namespace VisualComposer\Modules\System\TextDomain;

use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Traits\EventsFilters;

//use VisualComposer\Framework\Illuminate\Support\Module;

/**
 * Class Controller.
 */
class Controller extends Container /*implements Module*/
{
    use EventsFilters;

    /**
     * Controller constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\System\TextDomain\Controller::setDomain */
        $this->addEvent(
            'vcv:inited',
            'setDomain'
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
