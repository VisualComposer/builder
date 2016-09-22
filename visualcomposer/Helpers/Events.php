<?php

namespace VisualComposer\Helpers;

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
}
