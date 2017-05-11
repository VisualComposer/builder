<?php

namespace VisualComposer\Framework;

use VisualComposer\Framework\Illuminate\Container\Container as ContainerContract;
use VisualComposer\Framework\Illuminate\Filters\Dispatcher as FiltersDispatcher;
use VisualComposer\Framework\Illuminate\Events\Dispatcher as EventsDispatcher;

/**
 * Class Application.
 */
class Application extends ContainerContract
{
    /**
     * The available container bindings and their respective load methods.
     *
     * @var array
     */
    protected $availableBindings = [
        'EventsHelper' => 'registerEventBindings',
        'FiltersHelper' => 'registerFilterBindings',
        'Autoload' => 'registerAutoloadBindings',
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
     * Register container bindings for the application.
     *
     * @return $this
     */
    protected function registerAutoloadBindings()
    {
        $this->singleton(
            'Autoload',
            function ($app) {
                return (new Autoload($app));
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
        $abstract = $this->getAlias($abstract);
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

    /**
     * @param $pattern - file pattern to search.
     * @param int $flags
     *
     * @return array
     */
    public function rglob($pattern, $flags = 0)
    {
        $files = glob($pattern, $flags);
        foreach (glob(dirname($pattern) . '/*', GLOB_ONLYDIR | GLOB_NOSORT) as $dir) {
            $files = array_merge($files, $this->rglob($dir . '/' . basename($pattern), $flags));
        }

        return (array)$files;
    }

    /**
     * Get plugin dir path + custom dir.
     *
     * @param $path
     *
     * @return string
     */
    public function path($path = '')
    {
        return $this->basePath . ltrim($path, '\//');
    }

    /**
     * @param $componentName
     * @param $componentController
     * @param bool $make
     * @param bool $singleton
     *
     * @return $this
     */
    public function addComponent($componentName, $componentController, $make = true, $singleton = true)
    {
        if (!$this->bound($componentController)) {
            if ($singleton) {
                $this->singleton($componentController);
            }
            $this->alias($componentController, $componentName);
            if ($make) {
                $this->make($componentController);
            }
        }

        return $this;
    }
}
