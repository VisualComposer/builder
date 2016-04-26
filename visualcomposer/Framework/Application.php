<?php

namespace VisualComposer\Framework;

use VisualComposer\Framework\Illuminate\Container\Container;
use VisualComposer\Framework\Illuminate\Contracts\Foundation\Application as ApplicationContract;
use VisualComposer\Framework\Illuminate\Filters\Dispatcher as FiltersDispatcher;
use VisualComposer\Framework\Illuminate\Events\Dispatcher as EventsDispatcher;

/**
 * Class Application.
 */
class Application extends Container implements ApplicationContract
{
    /**
     * The available container bindings and their respective load methods.
     *
     * @var array
     */
    protected $availableBindings = [
        'VisualComposer\Framework\Illuminate\Contracts\Events\Dispatcher' => 'registerEventBindings',
        'EventsHelper' => 'registerEventBindings',
        'VisualComposer\Framework\Illuminate\Contracts\Filters\Dispatcher' => 'registerFilterBindings',
        'FiltersHelper' => 'registerFilterBindings',
    ];
    /**
     * The service binding methods that have been executed.
     *
     * @var array
     */
    protected $ranServiceBinders = [];
    /**
     * The loaded service providers.
     *
     * @var array
     */
    protected $loadedProviders = [];
    protected $basePath;

    /**
     * Create a new Lumen application instance.
     *
     * @param  string|null $basePath
     */
    public function __construct($basePath = null)
    {
        $this->basePath = $basePath;
        $this->bootstrapContainer();
    }

    /**
     * Bootstrap the application container.
     */
    protected function bootstrapContainer()
    {
        static::setInstance($this);

        $this->instance('App', $this);

        $this->registerContainerAliases();
    }

    /**
     *
     */
    public function boot()
    {

    }

    /**
     * Register container bindings for the application.
     *
     * @return $this
     */
    protected function registerEventBindings()
    {
        $this->singleton(
            'EventsHelper',
            function ($app) {
                return (new EventsDispatcher($app));
            }
        );

        return $this;
    }

    /**
     * Register container bindings for the application.
     *
     * @return $this
     */
    protected function registerFilterBindings()
    {
        $this->singleton(
            'FiltersHelper',
            function ($app) {
                return (new FiltersDispatcher($app));
            }
        );

        return $this;
    }

    /**
     * Resolve the given type from the container.
     *
     * @param  string $abstract
     * @param  array $parameters
     *
     * @return mixed
     */
    public function make($abstract, $parameters = [])
    {
        if (array_key_exists($abstract, $this->availableBindings)
            && !array_key_exists($this->availableBindings[ $abstract ], $this->ranServiceBinders)
        ) {
            $this->{$method = $this->availableBindings[ $abstract ]}();

            $this->ranServiceBinders[ $method ] = true;
        }

        return parent::make($abstract, $parameters);
    }

    /**
     * Register the core container aliases.
     */
    protected function registerContainerAliases()
    {
        $this->aliases = [];
    }
}
