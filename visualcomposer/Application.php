<?php

namespace VisualComposer;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Application as ApplicationFactory;
use VisualComposer\Framework\Autoload;
use VisualComposer\Framework\Illuminate\Filters\Dispatcher as FiltersDispatcher;
use VisualComposer\Framework\Illuminate\Events\Dispatcher as EventsDispatcher;

/**
 * Main plugin instance which controls modules and helpers.
 * Provides Inner and Outer API with vcapp() helper.
 *
 * Class Application.
 */
class Application extends ApplicationFactory
{
    /**
     * The available container bindings and their respective load methods.
     * @see \VisualComposer\Application::registerEventBindings
     * @see \VisualComposer\Application::registerFilterBindings
     * @see \VisualComposer\Application::registerAutoloadBindings
     *
     * @var array
     */
    protected $availableBindings = [
        'EventsHelper' => 'registerEventBindings',
        'FiltersHelper' => 'registerFilterBindings',
        'Autoload' => 'registerAutoloadBindings',
    ];

    /**
     * @var bool
     */
    protected $inited = false;

    /**
     * @var bool
     */
    protected $adminInited = false;

    /**
     * @var bool
     */
    protected $booted = false;

    /**
     * @throws \VisualComposer\Framework\Illuminate\Container\BindingResolutionException
     */
    public function init($force = false)
    {
        if ($force || !$this->inited) {
            $this->inited = true;
            vcevent('vcv:inited', $this);
        }

        return $this;
    }

    /**
     * @throws \VisualComposer\Framework\Illuminate\Container\BindingResolutionException
     */
    public function adminInit($force = false)
    {
        if ($force || !$this->adminInited) {
            $this->adminInited = true;
            vcevent('vcv:admin:inited', $this);
        }

        return $this;
    }

    /**
     * Bootstraps registered modules( also creates an instance ).
     * And saves helpers as singletons.
     *
     * @return $this
     */
    public function boot()
    {
        if (!$this->booted) {
            $this->booted = true;
            parent::boot();
            do_action('vcv:boot', $this);
        }

        return $this;
    }

    /**
     * Register the core container aliases.
     * Used in Dependency Injection.
     * @see docs/php/DependencyInjection.md
     */
    protected function registerContainerAliases()
    {
        parent::registerContainerAliases();
        $this->aliases = [
            // Inner bindings.
            'VisualComposer\Application' => 'App',
            'VisualComposer\Framework\Application' => 'App',
            'VisualComposer\Framework\Illuminate\Container\Container' => 'App',
            'VisualComposer\Framework\Illuminate\Contracts\Container\Container' => 'App',
            'VisualComposer\Helpers\Events' => 'EventsHelper',
            'VisualComposer\Helpers\Filters' => 'FiltersHelper',
            'VisualComposer\Framework\Autoload' => 'Autoload',
        ];
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
}
