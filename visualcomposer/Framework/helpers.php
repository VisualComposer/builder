<?php

use VisualComposer\Framework\Illuminate\Container\Container;

if (!function_exists('vcapp')) {
    /**
     * Get the available container instance.
     *
     * @param  string $make
     * @param  array $parameters
     * @return mixed|\VisualComposer\Application
     */
    function vcapp($make = null, $parameters = [])
    {
        if (is_null($make)) {
            return Container::getInstance();
        }

        return Container::getInstance()->make($make, $parameters);
    }
}

if (!function_exists('vcevent')) {
    /**
     * Fire an event and call the listeners.
     *
     * @param  string $event
     * @param  mixed $payload
     * @param  bool $halt
     * @return array|null
     */
    function vcevent($event, $payload = [], $halt = false)
    {
        return vcapp('eventsHelper')->fire($event, $payload, $halt);
    }
}

if (!function_exists('vcview')) {
    function vcview($path, $args = [], $echo = true)
    {
        return vcapp('templatesHelper')->render($path, $args, $echo);
    }
}
