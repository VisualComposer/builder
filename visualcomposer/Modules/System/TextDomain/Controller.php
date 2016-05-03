<?php

namespace VisualComposer\Modules\System\TextDomain;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;

/**
 * Class Controller.
 */
class Controller extends Container implements Module
{
    /**
     * Controller constructor.
     */
    public function __construct()
    {
        add_action(
            'init',
            function () {
                /** @see \VisualComposer\Modules\System\TextDomain\Controller::setDomain */
                $this->call('setDomain');
            }
        );
    }

    /**
     *
     */
    public function setDomain()
    {
        load_plugin_textdomain('vc5', false, VCV_PLUGIN_DIRNAME . '/languages');
    }
}
