<?php

use VisualComposer\Framework\Illuminate\Container\Container as FrameworkContainer;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

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

        $strHelper = vchelper('Str');
        if ($strHelper->startsWith($value, '"') && $strHelper->endsWith($value, '"')) {
            $value = substr($value, 1, -1);
        }
        $value = $strHelper->convert($value);

        return $value;
    }
}

/**
 * @return mixed|\VisualComposer\Application
 */
function vcvboot()
{
    require_once VCV_PLUGIN_DIR_PATH . 'bootstrap/app.php';

    return vcapp();
}

function vcvinit()
{
    require_once VCV_PLUGIN_DIR_PATH . 'bootstrap/app.php';
    vcapp()->init();
}

function vcvadmininit()
{
    require_once VCV_PLUGIN_DIR_PATH . 'bootstrap/app.php';
    vcapp()->adminInit();
}
