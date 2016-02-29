<?php

namespace VisualComposer\Modules\System\TextDomain;

use VisualComposer\Helpers\WordPress\Actions;
use VisualComposer\Modules\System\Container;

class TextDomainController extends Container
{
    public function __construct()
    {
        Actions::add('init', function () {
            $this->call('setDomain');
        });
    }

    private function setDomain()
    {
        load_plugin_textdomain('vc5', false, VC_V_PLUGIN_DIRNAME.'/languages');
    }
}
