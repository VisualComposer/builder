<?php

namespace VisualComposer\Helpers;

use RuntimeException;
use VisualComposer\Framework\Illuminate\Support\Helper;

/**
 * Class Str.
 */
class Str implements Helper
{
    /**
     * The cache of snake-cased words.
     *
     * @var array
     */
    protected static $snakeCache = [];

    /**
     * The cache of camel-cased words.
     *
     * @var array
     */
    protected static $camelCache = [];

    /**
     * The cache of studly-cased words.
     *
     * @var array
     */
    protected static $studlyCache = [];

    /**
     * Convert a value to camel case.
     *
     * @param  string $value
     *
     * @return string
     */
    public function camel($value)
    {
        if (isset(static::$camelCache[ $value ])) {
            return static::$camelCache[ $value ];
        }

        return static::$camelCache[ $value ] = lcfirst(static::studly($value));
    }

    /**
     * Determine if a given string contains a given substring.
     *
     * @param  string $haystack
     * @param  string|array $needles
     *
     * @return bool
     */
    public function contains($haystack, $needles)
    {
        foreach ((array)$needles as $needle) {
            if ($needle != '' && strpos($haystack, $needle) !== false) {
                return true;
            }
        }

        return false;
    }

    /**
     * Determine if a given string ends with a given substring.
     *
     * @param  string $haystack
     * @param  string|array $needles
     *
     * @return bool
     */
    public function endsWith($haystack, $needles)
    {
        foreach ((array)$needles as $needle) {
            if ((string)$needle === substr($haystack, -strlen($needle))) {
                return true;
            }
        }

        return false;
    }

    /**
     * Cap a string with a single instance of a given value.
     *
     * @param  string $value
     * @param  string $cap
     *
     * @return string
     */
    public function finish($value, $cap)
    {
        $quoted = preg_quote($cap, '/');

        return preg_replace('/(?:' . $quoted . ')+$/', '', $value) . $cap;
    }

    /**
     * Determine if a given string matches a given pattern.
     *
     * @param  string $pattern
     * @param  string $value
     *
     * @return bool
     */
    public function is($pattern, $value)
    {
        if ($pattern === $value) {
            return true;
        }

        $pattern = preg_quote($pattern, '#');

        // Asterisks are translated into zero-or-more regular expression wildcards
        // to make it convenient to check if the strings starts with the given
        // pattern such as "library/*", making any string check convenient.
        $pattern = str_replace('\*', '.*', $pattern) . '\z';

        return (bool)preg_match('#^' . $pattern . '#', $value);
    }

    /**
     * Return the length of the given string.
     *
     * @param  string $value
     *
     * @return int
     */
    public function length($value)
    {
        return mb_strlen($value);
    }

    /**
     * Limit the number of characters in a string.
     *
     * @param  string $value
     * @param  int $limit
     * @param  string $end
     *
     * @return string
     */
    public function limit($value, $limit = 100, $end = '...')
    {
        if (mb_strlen($value) <= $limit) {
            return $value;
        }

        return rtrim(mb_substr($value, 0, $limit, 'UTF-8')) . $end;
    }

    /**
     * Convert the given string to lower-case.
     *
     * @param  string $value
     *
     * @return string
     */
    public function lower($value)
    {
        return mb_strtolower($value);
    }

    /**
     * Generate a "random" alpha-numeric string.
     *
     * Should not be considered sufficient for cryptography, etc.
     *
     * @param  int $length
     *
     * @return string
     */
    public function quickRandom($length = 16)
    {
        if (intval($length) < 1) {
            return '';
        }

        $pool = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

        return substr(str_shuffle(str_repeat($pool, $length)), 0, $length);
    }

    /**
     * Convert the given string to upper-case.
     *
     * @param  string $value
     *
     * @return string
     */
    public function upper($value)
    {
        return mb_strtoupper($value);
    }

    /**
     * Convert the given string to title case.
     *
     * @param  string $value
     *
     * @return string
     */
    public function title($value)
    {
        return mb_convert_case($value, MB_CASE_TITLE, 'UTF-8');
    }

    /**
     * Convert a string to snake case.
     *
     * @param  string $value
     * @param  string $delimiter
     *
     * @return string
     */
    public function snake($value, $delimiter = '_')
    {
        $key = $value . $delimiter;

        if (isset(static::$snakeCache[ $key ])) {
            return static::$snakeCache[ $key ];
        }

        if (!ctype_lower($value)) {
            $value = strtolower(preg_replace('/(.)(?=[A-Z])/', '$1' . $delimiter, $value));
        }

        return static::$snakeCache[ $key ] = $value;
    }

    /**
     * Determine if a given string starts with a given substring.
     *
     * @param  string $haystack
     * @param  string|array $needles
     *
     * @return bool
     */
    public function startsWith($haystack, $needles)
    {
        foreach ((array)$needles as $needle) {
            if ($needle != '' && strpos($haystack, $needle) === 0) {
                return true;
            }
        }

        return false;
    }

    /**
     * Convert a value to studly caps case.
     *
     * @param  string $value
     *
     * @return string
     */
    public function studly($value)
    {
        $key = $value;

        if (isset(static::$studlyCache[ $key ])) {
            return static::$studlyCache[ $key ];
        }

        $value = ucwords(str_replace(['-', '_'], ' ', $value));

        return static::$studlyCache[ $key ] = str_replace(' ', '', $value);
    }
}
