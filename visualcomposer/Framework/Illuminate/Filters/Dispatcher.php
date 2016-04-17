<?php

namespace VisualComposer\Framework\Illuminate\Filters;

use VisualComposer\Framework\Illuminate\Events\Dispatcher as EventsDispatcher;

/**
 * Class Dispatcher
 */
class Dispatcher extends EventsDispatcher
{
    /**
     * Fire an event and call the listeners
     *
     * @param  string|object $event
     * @param  mixed $payload
     * @param  bool $halt
     *
     * @return array|null
     */
    public function fire($event, $payload = [], $halt = false)
    {
        // When the given "event" is actually an object we will assume it is an event
        // object and use the class as the event name and this event itself as the
        // payload to the handler, which makes object based events quite simple
        if (is_object($event)) {
            list($payload, $event) = [[$event], get_class($event)];
        }

        $value = isset($payload[0]) ? $payload[0] : ''; // get the value, the first argument is always the value

        // If an array is not given to us as the payload, we will turn it into one so
        // we can easily use call_user_func_array on the listeners, passing in the
        // payload to each of them so that they receive each of these arguments
        if (!is_array($payload)) {
            $payload = [$payload];
        }

        $this->firing[] = $event;
        /** @var \VisualComposer\Framework\Application $vcapp */
        $vcapp = vcapp();
        foreach ($this->getListeners($event) as $listener) {
            $payload[0] = $value;
            $response = $vcapp->call($listener, $payload);

            // If a response is returned from the listener and event halting is enabled
            // we will just return this response, and not call the rest of the event
            // listeners. Otherwise we will add the response on the response list
            if (!is_null($response) && $halt) {
                array_pop($this->firing);

                return $response;
            }

            // If a boolean false is returned from a listener, we will stop propagating
            // the event to any further listeners down in the chain, else we keep on
            // looping through the listeners and firing every one in our sequence
            if ($response === false) {
                break;
            }

            $value = $response;
        }

        array_pop($this->firing);

        return $value;
    }
}
