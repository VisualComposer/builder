<?php

namespace VisualComposer\Helpers\Settings;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Helper;

class TabsRegistry extends Container implements Helper
{
    private static $tabs = [];

    public function set($key, $value)
    {
        self::$tabs[ $key ] = $value;
    }

    public function get($key)
    {
        return isset(self::$tabs[ $key ]) ? self::$tabs[ $key ] : null;
    }

    public function all()
    {
        return self::$tabs;
    }
}
