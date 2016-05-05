<?php

namespace VisualComposer\Framework\Illuminate\Filters;

use VisualComposer\Helpers\Filters as DispatcherContract;
use VisualComposer\Framework\Illuminate\Events\Dispatcher as EventsDispatcher;

/**
 * Class Dispatcher.
 */
class Dispatcher extends EventsDispatcher implements DispatcherContract
{
    /**
     * Fire an event and call the listeners.
     *
     * @param  string|object $filter
     * @param string $body
     * @param  mixed $payload
     *
     * @return array|null
     */
    public function fire($filter, $body = '', $payload = [])
    {
        $response = $body;
        /** @var \VisualComposer\Framework\Application $vcapp */
        $vcapp = vcapp();
        foreach ($this->getListeners($filter) as $listener) {
            $response = $vcapp->call($listener, [$response, $payload]);
        }

        return $response;
    }
}
