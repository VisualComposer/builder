<?php

namespace VisualComposer\Helpers\Settings;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use Exception;
use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Helper;

/**
 * Implements the Registry design pattern for storing visual composer settings fields
 * Class FieldsRegistry.
 */
class FieldsRegistry extends Container implements Helper
{
    private static $fields = [];

    public function set($key, $value)
    {
        if (!array_key_exists('fieldCallback', $value)) {
            throw new Exception('render fieldCallback argument missing for field');
        }
        if (!array_key_exists('id', $value)) {
            throw new Exception('id argument missing for field');
        }
        self::$fields[ $key ] = $value;
    }

    public function get($key)
    {
        return isset(self::$fields[ $key ]) ? self::$fields[ $key ] : null;
    }

    public function all()
    {
        return self::$fields;
    }

    public function findBySlug($slug, $key = 'slug')
    {
        $all = $this->all();
        $result = array_filter(
            $all,
            function ($item) use ($slug, $key) {
                return $item[ $key ] === $slug;
            }
        );

        return $result;
    }
}
