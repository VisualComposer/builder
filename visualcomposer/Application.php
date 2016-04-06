<?php

namespace VisualComposer;

use VisualComposer\Framework\Application as ApplicationFactory;
use VisualComposer\Framework\Illuminate\Contracts\Foundation\Application as ApplicationContract;

/**
 * Main plugin instance which controls modules and helpers
 * Provides Inner and Outer API with vcapp() helper
 *
 * Class Application
 * @package VisualComposer
 */
class Application extends ApplicationFactory implements ApplicationContract
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
        $this->basePath = $basePath;
        $this->bootstrapContainer();

        /**
         * Add action for init state
         */
        add_action(
            'init',
            function () {
                do_action('vcv:inited', $this);
                if (isset($_REQUEST[ VCV_AJAX_REQUEST ])) {
                    /** @noinspection PhpIncludeInspection */
                    require_once $this->path('visualcomposer/Modules/System/Loader.php');
                    die;
                }
            }
        );
        do_action('vcv:load', $this);
    }

    /**
     * Bootstraps registred modules( also creates an instance )
     * And saves helpers as singletons
     *
     * @return $this
     */
    public function boot()
    {
        do_action('vcv:boot', $this);

        return $this;
    }

    /**
     * @param $pattern - file pattern to search
     * @param int $flags
     *
     * @return array
     */
    public function rglob($pattern, $flags = 0)
    {
        $files = glob(apply_filters('vcv:application:rglob', $pattern), $flags);
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
        $this->singleton($componentController);
        $this->alias($componentController, $componentName);
        if ($make) {
            $this->make($componentController);
        }

        return $this;
    }

    /**
     * Get plugin dir path + custom dir
     *
     * @param $path
     *
     * @return string
     */
    public function path($path = '')
    {
        return apply_filters('vcv:application:path', $this->basePath . ltrim($path, '\//'), $path, $this);
    }

    /**
     * Register the core container aliases.
     * Used in Dependency Injection
     * @see \docs\php\DependencyInjection.md
     */
    protected function registerContainerAliases()
    {
        $this->aliases = [
            'VisualComposer\Application' => 'App',
            'VisualComposer\Framework\Application' => 'App',
            'VisualComposer\Framework\Illuminate\Contracts\Foundation\Application' => 'App',
            'VisualComposer\Framework\Illuminate\Container\Container' => 'App',
            'VisualComposer\Framework\Illuminate\Contracts\Container\Container' => 'App',
            'VisualComposer\Framework\Illuminate\Contracts\Events\Dispatcher' => 'EventsHelper',
        ];
    }
}
