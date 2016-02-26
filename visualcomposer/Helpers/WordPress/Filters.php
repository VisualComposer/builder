<?php

namespace VisualComposer\Helpers\WordPress;

abstract class Filters
{
    public static function add($name, $callback)
    {
        add_filter($name, $callback);
    }
}