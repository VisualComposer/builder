<?php

namespace VisualComposer\Framework\Illuminate\Events;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Container\Container;
use VisualComposer\Helpers\Events as DispatcherContract;
use VisualComposer\Framework\Illuminate\Contracts\Container\Container as ContainerContract;
use VisualComposer\Helpers\Str;

/**
 * Class Dispatcher.
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
     * The wildcard listeners cache.
     *
     * @var array
     */
    protected $wildcardsCache = [];

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

    protected $strHelper;

    /**
     * Create a new event dispatcher instance.
     *
     * @param \VisualComposer\Framework\Illuminate\Contracts\Container\Container $container
     */
    public function __construct(ContainerContract $container = null)
    {
        $this->strHelper = vchelper('Str');
        $this->container = $container ?: new Container();
    }

    /**
     * Register an event listener with the dispatcher.
     *
     * @param string|array $events
     * @param mixed $listener
     * @param int $weight
     */
    public function listen($events, $listener, $weight = 0)
    {
        if (is_string($events)) {
            $events = preg_split('/\,\s*|\s+/', $events);
        }
        foreach ((array)$events as $event) {
            if ($this->strHelper->contains($event, '*')) {
                $this->setupWildcardListen($event, $listener);
            } else {
                $this->listeners[ $event ][ $weight ][] = $listener;

                unset($this->sorted[ $event ]);
            }
        }
    }

    /**
     * Setup a wildcard listener callback.
     *
     * @param string $event
     * @param mixed $listener
     */
    protected function setupWildcardListen($event, $listener)
    {
        $this->wildcards[ $event ][] = $listener;
        $this->wildcardsCache = [];
    }

    /**
     * Fire an event and call the listeners.
     *
     * @param string|object $event
     * @param mixed $payload
     *
     * @return array|null
     */
    public function fire($event, $payload = [])
    {
        // If an array is not given to us as the payload, we will turn it into one so
        // we can easily use call_user_func_array on the listeners, passing in the
        // payload to each of them so that they receive each of these arguments.
        if (!is_array($payload)) {
            $payload = [$payload];
        }
        if (empty($payload)) {
            $payload = [
                'payload' => [],
            ];
        }

        $this->firing[] = $event;
        $responses = [];
        /** @var \VisualComposer\Framework\Application $vcapp */
        $vcapp = vcapp();
        foreach ($this->getListeners($event) as $listener) {
            $response = $vcapp->call($listener, $payload);

            $responses[] = $response;
        }

        array_pop($this->firing);

        return $responses;
    }

    /**
     * Get all of the listeners for a given event name.
     *
     * @param string $eventName
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
     * @param string $eventName
     *
     * @return array
     */
    protected function getWildcardListeners($eventName)
    {
        if (isset($this->wildcardsCache[ $eventName ])) {
            return $this->wildcardsCache[ $eventName ];
        }
        $wildcards = [];
        /** @var \VisualComposer\Helpers\Str $strHelper */
        $strHelper = vchelper('Str');
        foreach ($this->wildcards as $key => $listeners) {
            if ($strHelper->is($key, $eventName)) {
                $wildcards = array_merge($wildcards, $listeners);
            }
        }

        $this->wildcardsCache[ $eventName ] = $wildcards;

        return $this->wildcardsCache[ $eventName ];
    }

    /**
     * Sort the listeners for a given event by weight.
     *
     * @param string $eventName
     *
     * @return array
     */
    protected function sortListeners($eventName)
    {
        $this->sorted[ $eventName ] = [];

        // If listeners exist for the given event, we will sort them by the weight
        // so that we can call them in the correct order. We will cache off these
        // sorted event listeners so we do not have to re-sort on every events.
        if (isset($this->listeners[ $eventName ])) {
            ksort($this->listeners[ $eventName ]);

            $this->sorted[ $eventName ] = call_user_func_array(
                'array_merge',
                $this->listeners[ $eventName ]
            );
        }

        return $this->sorted[ $eventName ];
    }

    /**
     * Remove a set of listeners from the dispatcher.
     *
     * @param string $event
     *
     * @return void
     */
    public function forget($event)
    {
        if ($this->strHelper->contains($event, '*')) {
            unset($this->wildcards[ $event ]);
        } else {
            unset($this->listeners[ $event ], $this->sorted[ $event ]);
        }

        foreach ($this->wildcardsCache as $key => $listeners) {
            if ($this->strHelper->is($event, $key)) {
                unset($this->wildcardsCache[ $key ]);
            }
        }
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
}
