<?php

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

/**
 * PHP 5.1! No namespaces must be there!
 */

/**
 * Class VcvEnv.
 */
class VcvEnv
{
    protected static $variables = [];

    public static function has($key)
    {
        return array_key_exists($key, VcvEnv::$variables);
    }

    public static function get($key, $default = null)
    {
        return VcvEnv::has($key) ? VcvEnv::$variables[ $key ] : $default;
    }

    public static function set($key, $value)
    {
        VcvEnv::$variables[ $key ] = $value;
    }

    public static function all()
    {
        return VcvEnv::$variables;
    }
}
