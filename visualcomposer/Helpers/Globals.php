<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;

class Globals implements Helper
{
    protected static $globalCache = [];

    public function backup($prefix, $key)
    {
        self::$globalCache[ $prefix . '_' . $key ] = $GLOBALS[ $key ];
    }

    public function set($key, $value)
    {
        $GLOBALS[ $key ] = $value;
    }

    public function get($key)
    {
        return $GLOBALS[ $key ];
    }

    public function restore($prefix, $key)
    {
        if (isset(self::$globalCache[ $prefix . '_' . $key ])) {
            $GLOBALS[ $key ] = self::$globalCache[ $prefix . '_' . $key ];
            unset(self::$globalCache[ $prefix . '_' . $key ]); // clear memory leak
        }
    }
}
