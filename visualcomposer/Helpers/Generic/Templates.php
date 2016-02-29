<?php

namespace VisualComposer\Helpers\Generic;

abstract class Templates
{
    public static function includeTemplate($_path, $_args = array(), $_echo = false)
    {
        ob_start();
        extract($_args);
        include(apply_filters('vc:v:helpers:templates:includeTemplate', VC_V_PLUGIN_DIR_PATH.'resources/views/'.ltrim($_path, '/\\'), $_path, $_args, $_echo));
        $_content = ob_get_clean();
        if ($_echo) {
            echo $_content;
        }

        return $_content;
    }
}