<?php

namespace VisualComposer\Framework;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Container\Container as ContainerContract;

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
    protected $availableBindings = [];

    /**
     * The service binding methods that have been executed.
     *
     * @var array
     */
    protected $ranServiceBinders = [];

    protected $basePath;

    /**
     * Create a new Lumen application instance.
     *
     * @param string|null $basePath
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
     * Resolve the given type from the container.
     *
     * @param string $abstract
     * @param array $parameters
     *
     * @return mixed
     */
    public function make($abstract, $parameters = [])
    {
        $abstract = $this->getAlias($abstract);
        if (
            array_key_exists($abstract, $this->availableBindings)
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
    public function glob($pattern, $flags = 0)
    {
        $files = glob($pattern, $flags);

        return $files === false ? [] : (array)$files;
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
     * @param bool $singleton
     *
     * @return $this
     */
    public function addComponent($componentName, $componentController, $singleton = true)
    {
        if (!$this->bound($componentController)) {
            if ($singleton) {
                $this->singleton($componentController);
            }
            $this->alias($componentController, $componentName);
        }

        return $this;
    }
}
