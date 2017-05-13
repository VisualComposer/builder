<?php

use VisualComposer\Framework\Illuminate\Container\Container as FrameworkContainer;

/**
 * Get the available container instance.
 *
 * @param  string $make
 * @param  array $parameters
 *
 * @return mixed
 */
function vcapp($make = null, $parameters = [])
{
    if (is_null($make)) {
        return FrameworkContainer::getInstance();
    }

    return FrameworkContainer::getInstance()->make($make, $parameters);
}

/**
 * Get the available container instance.
 *
 * @param  string $name
 * @param  array $parameters
 *
 * @return mixed
 */
function vchelper($name, $parameters = [])
{
    return vcapp($name . 'Helper', $parameters);
}

/**
 * Fire an event and call the listeners.
 *
 * @param  string $event
 * @param  mixed $payload
 *
 * @return array|null
 */
function vcevent($event, $payload = [])
{
    /** @see \VisualComposer\Framework\Illuminate\Events\Dispatcher::fire */
    return vchelper('Events')->fire($event, $payload);
}

/**
 * Fire an event and call the listeners.
 *
 * @param  string $filter
 * @param  string $body
 * @param  mixed $payload
 *
 * @return array|null
 */
function vcfilter($filter, $body = '', $payload = [])
{
    /** @see \VisualComposer\Framework\Illuminate\Filters\Dispatcher::fire */
    return vchelper('Filters')->fire($filter, $body, $payload);
}

/**
 * @param $path
 * @param array $args
 *
 * @return mixed|string
 */
function vcview($path, $args = [])
{
    /** @see \VisualComposer\Helpers\Views::render */
    return vchelper('Views')->render($path, $args);
}

if (!function_exists('vcvenv')) {
    /**
     * Gets the value of an environment variable. Supports boolean, empty and null.
     *
     * @param  string $key
     * @param  mixed $default
     *
     * @return mixed
     */
    function vcvenv($key, $default = null)
    {
        $value = getenv($key);
        if ($value === false) {
            return $default;
        }
        switch (strtolower($value)) {
            case 'true':
            case '(true)':
                return true;
            case 'false':
            case '(false)':
                return false;
            case 'empty':
            case '(empty)':
                return '';
            case 'null':
            case '(null)':
                return;
        }
        $strHelper = vchelper('Str');
        if ($strHelper->startsWith($value, '"') && $strHelper->endsWith($value, '"')) {
            return substr($value, 1, -1);
        }

        return $value;
    }
}
