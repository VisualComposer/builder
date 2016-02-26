<?php

namespace VisualComposer\Helpers\WordPress;

abstract class Actions
{
    public static function add($name, $callback)
    {
        add_action($name, $callback);
    }
}