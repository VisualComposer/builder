<?php

namespace VisualComposer\Modules\System\TextDomain;

use VisualComposer\Framework\Container;

/**
 * Class Controller
 * @package VisualComposer\Modules\System\TextDomain
 */
class Controller extends Container
{
    /**
     * Controller constructor.
     */
    public function __construct()
    {
        add_action(
            'init',
            function () {
                $this->call('setDomain');
            }
        );
    }

    /**
     *
     */
    private function setDomain()
    {
        load_plugin_textdomain('vc5', false, VC_V_PLUGIN_DIRNAME . '/languages');
    }
}
