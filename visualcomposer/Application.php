<?php

namespace VisualComposer;

use VisualComposer\Framework\Application as ApplicationFactory;

/**
 * Main plugin instance which controls modules and helpers.
 * Provides Inner and Outer API with vcapp() helper.
 *
 * Class Application.
 */
class Application extends ApplicationFactory
{
    /**
     * Create a new Application instance.
     *
     * @overrides parent::__construct()
     *
     * @param  string|null $basePath
     *
     * @noinspection PhpMissingParentConstructorInspection
     */
    public function __construct($basePath = null)
    {
        parent::__construct($basePath);

        /**
         * Add action for init state.
         */
        add_action(
            'init',
            [
                $this,
                'init',
            ]
        );
    }

    public function init()
    {
        vcevent('vcv:inited', $this);
    }

    /**
     * Bootstraps registred modules( also creates an instance ).
     * And saves helpers as singletons.
     *
     * @return $this
     */
    public function boot()
    {
        parent::boot();
        do_action('vcv:boot', $this);

        return $this;
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
     * @param $componentName
     * @param $componentController
     * @param bool $make
     *
     * @return $this
     */
    public function addComponent($componentName, $componentController, $make = true)
    {
        if (!$this->bound($componentController)) {
            $this->singleton($componentController);
            $this->alias($componentController, $componentName);
            if ($make) {
                $this->make($componentController);
            }
        }

        return $this;
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
     * Register the core container aliases.
     * Used in Dependency Injection.
     * @see \docs\php\DependencyInjection.md
     */
    protected function registerContainerAliases()
    {
        parent::registerContainerAliases();
        $this->aliases = [
            // Inner bindings.
            'VisualComposer\Application' => 'App',
            'VisualComposer\Framework\Application' => 'App',
            'VisualComposer\Framework\Illuminate\Contracts\Foundation\Application' => 'App',
            'VisualComposer\Framework\Illuminate\Container\Container' => 'App',
            'VisualComposer\Framework\Illuminate\Contracts\Container\Container' => 'App',
            'VisualComposer\Helpers\Events' => 'EventsHelper',
            'VisualComposer\Helpers\Filters' => 'FiltersHelper',
            'VisualComposer\Framework\Autoload' => 'Autoload',
        ];

        return $this;
    }
}
