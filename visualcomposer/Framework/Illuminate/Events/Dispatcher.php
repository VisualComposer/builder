<?php namespace VisualComposer\Framework\Illuminate\Events;

use VisualComposer\Framework\Illuminate\Container\Container;
use VisualComposer\Framework\Illuminate\Contracts\Events\Dispatcher as DispatcherContract;
use VisualComposer\Framework\Illuminate\Contracts\Container\Container as ContainerContract;
use VisualComposer\Helpers\Generic\Str;

/**
 * Class Dispatcher
 * @package VisualComposer\Framework\Illuminate\Events
 */
class Dispatcher implements DispatcherContract
{
    /**
     * The IoC container instance.
     *
     * @var \VisualComposer\Framework\Illuminate\Contracts\Container\Container
     */
    protected $container;
    /**
     * The registered event listeners.
     *
     * @var array
     */
    protected $listeners = [];
    /**
     * The wildcard listeners.
     *
     * @var array
     */
    protected $wildcards = [];
    /**
     * The sorted event listeners.
     *
     * @var array
     */
    protected $sorted = [];
    /**
     * The event firing stack.
     *
     * @var array
     */
    protected $firing = [];
    /**
     * The queue resolver instance.
     *
     * @var callable
     */
    protected $queueResolver;

    /**
     * Create a new event dispatcher instance.
     *
     * @param  \VisualComposer\Framework\Illuminate\Contracts\Container\Container $container
     */
    public function __construct(ContainerContract $container = null)
    {
        $this->container = $container ?: new Container;
    }

    /**
     * Register an event listener with the dispatcher.
     *
     * @param  string|array $events
     * @param  mixed $listener
     * @param  int $priority
     */
    public function listen($events, $listener, $priority = 0)
    {
        /** @var Str $strHelper */
        $strHelper = vchelper('str');
        foreach ((array)$events as $event) {
            if ($strHelper->contains($event, '*')) {
                $this->setupWildcardListen($event, $listener);
            } else {
                $this->listeners[ $event ][ $priority ][] = $listener;

                unset($this->sorted[ $event ]);
            }
        }
    }

    /**
     * Setup a wildcard listener callback.
     *
     * @param  string $event
     * @param  mixed $listener
     */
    protected function setupWildcardListen($event, $listener)
    {
        $this->wildcards[ $event ][] = $listener;
    }

    /**
     * Determine if a given event has listeners.
     *
     * @param  string $eventName
     *
     * @return bool
     */
    public function hasListeners($eventName)
    {
        return isset($this->listeners[ $eventName ]);
    }

    /**
     * Register an event and payload to be fired later.
     *
     * @param  string $event
     * @param  array $payload
     */
    public function push($event, $payload = [])
    {
        $this->listen(
            $event . '_pushed',
            function () use ($event, $payload) {
                $this->fire($event, $payload);
            }
        );
    }

    /**
     * Register an event subscriber with the dispatcher.
     *
     * @param  object|string $subscriber
     */
    public function subscribe($subscriber)
    {
        $subscriber = $this->resolveSubscriber($subscriber);

        $subscriber->subscribe($this);
    }

    /**
     * Resolve the subscriber instance.
     *
     * @param  object|string $subscriber
     *
     * @return mixed
     */
    protected function resolveSubscriber($subscriber)
    {
        if (is_string($subscriber)) {
            return $this->container->make($subscriber);
        }

        return $subscriber;
    }

    /**
     * Fire an event until the first non-null response is returned.
     *
     * @param  string $event
     * @param  array $payload
     *
     * @return mixed
     */
    public function until($event, $payload = [])
    {
        return $this->fire($event, $payload, true);
    }

    /**
     * Flush a set of pushed events.
     *
     * @param  string $event
     *
     * @return void
     */
    public function flush($event)
    {
        $this->fire($event . '_pushed');
    }

    /**
     * Get the event that is currently firing.
     *
     * @return string
     */
    public function firing()
    {
        return end($this->firing);
    }

    /**
     * Fire an event and call the listeners.
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
        // payload to the handler, which makes object based events quite simple.
        if (is_object($event)) {
            list($payload, $event) = [[$event], get_class($event)];
        }

        $responses = [];

        // If an array is not given to us as the payload, we will turn it into one so
        // we can easily use call_user_func_array on the listeners, passing in the
        // payload to each of them so that they receive each of these arguments.
        if (!is_array($payload)) {
            $payload = [$payload];
        }

        $this->firing[] = $event;
        /** @var \VisualComposer\Framework\Application $vcapp */
        $vcapp = vcapp();
        foreach ($this->getListeners($event) as $listener) {
            $response = $vcapp->call($listener, $payload);

            // If a response is returned from the listener and event halting is enabled
            // we will just return this response, and not call the rest of the event
            // listeners. Otherwise we will add the response on the response list.
            if (!is_null($response) && $halt) {
                array_pop($this->firing);

                return $response;
            }

            // If a boolean false is returned from a listener, we will stop propagating
            // the event to any further listeners down in the chain, else we keep on
            // looping through the listeners and firing every one in our sequence.
            if ($response === false) {
                break;
            }

            $responses[] = $response;
        }

        array_pop($this->firing);

        return $halt ? null : $responses;
    }

    /**
     * Get all of the listeners for a given event name.
     *
     * @param  string $eventName
     *
     * @return array
     */
    public function getListeners($eventName)
    {
        $wildcards = $this->getWildcardListeners($eventName);

        if (!isset($this->sorted[ $eventName ])) {
            $this->sortListeners($eventName);
        }

        return array_merge($this->sorted[ $eventName ], $wildcards);
    }

    /**
     * Get the wildcard listeners for the event.
     *
     * @param  string $eventName
     *
     * @return array
     */
    protected function getWildcardListeners($eventName)
    {
        $wildcards = [];
        /** @var \VisualComposer\Helpers\Generic\Str $strHelper */
        $strHelper = vchelper('str');
        foreach ($this->wildcards as $key => $listeners) {
            if ($strHelper->is($key, $eventName)) {
                $wildcards = array_merge($wildcards, $listeners);
            }
        }

        return $wildcards;
    }

    /**
     * Sort the listeners for a given event by priority.
     *
     * @param  string $eventName
     *
     * @return array
     */
    protected function sortListeners($eventName)
    {
        $this->sorted[ $eventName ] = [];

        // If listeners exist for the given event, we will sort them by the priority
        // so that we can call them in the correct order. We will cache off these
        // sorted event listeners so we do not have to re-sort on every events.
        if (isset($this->listeners[ $eventName ])) {
            krsort($this->listeners[ $eventName ]);

            $this->sorted[ $eventName ] = call_user_func_array(
                'array_merge',
                $this->listeners[ $eventName ]
            );
        }
    }

    /**
     * Remove a set of listeners from the dispatcher.
     *
     * @param  string $event
     *
     * @return void
     */
    public function forget($event)
    {
        unset($this->listeners[ $event ], $this->sorted[ $event ]);
    }

    /**
     * Forget all of the pushed listeners.
     *
     * @return void
     */
    public function forgetPushed()
    {
        /** @var \VisualComposer\Helpers\Generic\Str $strHelper */
        $strHelper = vchelper('str');
        foreach ($this->listeners as $key => $value) {
            if ($strHelper->endsWith($key, '_pushed')) {
                $this->forget($key);
            }
        }
    }
}
