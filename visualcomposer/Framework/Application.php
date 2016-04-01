<?php namespace VisualComposer\Framework;

use VisualComposer\Framework\Illuminate\Container\Container;
use VisualComposer\Framework\Illuminate\Contracts\Foundation\Application as ApplicationContract;

/**
 * Class Application
 * @package VisualComposer\Framework
 */
class Application extends Container implements ApplicationContract
{
    /**
     * The available container bindings and their respective load methods.
     *
     * @var array
     */
    public $availableBindings = [
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
     *
     * @return void
     */
    protected function bootstrapContainer()
    {
        static::setInstance($this);

        $this->instance('app', $this);

        $this->registerContainerAliases();
    }

    /**
     *
     */
    public function boot()
    {

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
     *
     * @return void
     */
    protected function registerContainerAliases()
    {
        $this->aliases = [];
    }
}
