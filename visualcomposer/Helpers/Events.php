<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

/**
 * Interface Events.
 */
interface Events
{
    /**
     * Register an event listener with the dispatcher.
     *
     * @param  string|array $events
     * @param  mixed $listener
     * @param  int $weight
     *
     * @return void
     */
    public function listen($events, $listener, $weight = 0);

    /**
     * Fire an event and call the listeners.
     *
     * @param  string|object $event
     * @param  mixed $payload
     *
     * @return array|null
     */
    public function fire($event, $payload = []);

    /**
     * Remove a set of listeners from the dispatcher.
     *
     * @param  string $event
     *
     * @return void
     */
    public function forget($event);

    /**
     * Remove a set of wildcard listeners from the dispatcher.
     *
     * @param  string $event
     *
     * @return void
     */
    public function forgetWildcard($event);

    /**
     * Get all of the listeners for a given event name.
     *
     * @param  string $eventName
     *
     * @return array
     */
    public function getListeners($eventName);

    /**
     * Return last called event
     *
     * @return string|null
     */
    public function firing();
}
