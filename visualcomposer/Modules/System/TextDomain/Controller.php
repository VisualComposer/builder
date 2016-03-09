<?php

namespace VisualComposer\Modules\System\TextDomain;

use VisualComposer\Framework\Container;

class Controller extends Container
{
    public function __construct()
    {
        add_action(
            'init',
            function () {
                $this->call('setDomain');
            }
        );
    }

    private function setDomain()
    {
        load_plugin_textdomain('vc5', false, VC_V_PLUGIN_DIRNAME . '/languages');
    }
}
