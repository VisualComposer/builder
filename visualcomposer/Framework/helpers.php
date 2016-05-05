<?php

use VisualComposer\Framework\Illuminate\Container\Container as FrameworkContainer;

if (!function_exists('vcapp')) {
    /**
     * Get the available container instance.
     *
     * @param  string $make
     * @param  array $parameters
     *
     * @return \VisualComposer\Application|mixed
     */
    function vcapp($make = null, $parameters = [])
    {
        if (is_null($make)) {
            return FrameworkContainer::getInstance();
        }

        return FrameworkContainer::getInstance()->make($make, $parameters);
    }
}

if (!function_exists('vchelper')) {
    /**
     * Get the available container instance.
     *
     * @param  string $name
     * @param  array $parameters
     *
     * @return mixed|\VisualComposer\Application
     */
    function vchelper($name, $parameters = [])
    {
        return vcapp($name . 'Helper', $parameters);
    }
}

if (!function_exists('vcevent')) {
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
}

if (!function_exists('vcfilter')) {
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
}

if (!function_exists('vcview')) {
    /**
     * @param $path
     * @param array $args
     *
     * @return mixed|string
     */
    function vcview($path, $args = [])
    {
        /** @see \VisualComposer\Helpers\Templates::render */
        return vchelper('Templates')->render($path, $args);
    }
}
