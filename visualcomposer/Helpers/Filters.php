<?php

namespace VisualComposer\Helpers;

use VisualComposer\Helpers\Events as EventsDispatcher;

/**
 * Interface Dispatcher.
 */
interface Filters extends EventsDispatcher
{
    /**
     * Fire an event and call the listeners.
     *
     * @param  string $filter
     * @param string $body
     * @param  mixed $payload
     *
     * @return array|null
     */
    public function fire($filter, $body = '', $payload = []);
}
