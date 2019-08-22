<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;

/**
 * Helper methods related to data manipulation.
 * Class Data.
 */
class Data implements Helper
{
    /**
     * @param $array
     * @param $column
     * @param $value
     *
     * @param bool $returnKey
     *
     * @return bool|int|string
     */
    public function arraySearch($array, $column, $value, $returnKey = false)
    {
        if (!is_array($array)) {
            return false;
        }
        foreach ($array as $key => $innerArray) {
            $exists = isset($innerArray[ $column ]) && $innerArray[ $column ] == $value;
            if ($exists) {
                if ($returnKey) {
                    return $key;
                } else {
                    return $innerArray;
                }
            }
        }

        return false;
    }

    /**
     * @param $array
     * @param $column
     * @param bool $returnValue
     *
     * @return bool|int|string
     */
    public function arraySearchKey($array, $column, $returnValue = false)
    {
        if (!is_array($array)) {
            return false;
        }
        foreach ($array as $key => $innerArray) {
            $exists = isset($innerArray[ $column ]);
            if ($exists) {
                if ($returnValue) {
                    return $innerArray[ $column ];
                } else {
                    return $key;
                }
            }
        }

        return false;
    }

    public function arrayColumn($array, $columnName)
    {
        return array_map(
            function ($element) use ($columnName) {
                return is_array($element) && isset($element[ $columnName ]) ? $element[ $columnName ] : null;
            },
            $array
        );
    }

    public function arrayDeepUnique($array)
    {
        return array_map('unserialize', array_unique(array_map('serialize', $array)));
    }

    /**
     * Remove one or many array items from a given array using "dot" notation.
     *
     * @param  array $array
     * @param  array|string $keys
     *
     * @return void
     */
    public function forget(&$array, $keys)
    {
        $original = &$array;

        $keys = (array)$keys;

        if (count($keys) === 0) {
            return;
        }

        foreach ($keys as $key) {
            // if the exact key exists in the top-level, remove it
            if ($this->exists($array, $key)) {
                unset($array[ $key ]);

                continue;
            }

            $parts = explode('.', $key);

            // clean up before each pass
            $array = &$original;

            while (count($parts) > 1) {
                $part = array_shift($parts);

                if (isset($array[ $part ]) && is_array($array[ $part ])) {
                    $array = &$array[ $part ];
                } else {
                    continue 2;
                }
            }

            unset($array[ array_shift($parts) ]);
        }
    }

    /**
     * Determine if the given key exists in the provided array.
     *
     * @param  \ArrayAccess|array $array
     * @param  string|int $key
     *
     * @return bool
     */
    public function exists($array, $key)
    {
        if ($array instanceof \ArrayAccess) {
            return $array->offsetExists($key);
        }

        return array_key_exists($key, $array);
    }
}
