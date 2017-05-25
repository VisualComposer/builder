<?php

namespace VisualComposer\Framework\Illuminate\Contracts\Container;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

/**
 * Interface Container.
 */
interface Container
{
    /**
     * Determine if the given abstract type has been bound.
     *
     * @param  string $abstract
     *
     * @return bool
     */
    public function bound($abstract);

    /**
     * Alias a type to a different name.
     *
     * @param  string $abstract
     * @param  string $alias
     *
     * @return void
     */
    public function alias($abstract, $alias);

    /**
     * Register a binding with the container.
     *
     * @param  string|array $abstract
     * @param  \Closure|string|null $concrete
     * @param  bool $shared
     */
    public function bind($abstract, $concrete = null, $shared = false);

    /**
     * Register a shared binding in the container.
     *
     * @param  string $abstract
     * @param  \Closure|string|null $concrete
     */
    public function singleton($abstract, $concrete = null);

    /**
     * Register an existing instance as shared in the container.
     *
     * @param  string $abstract
     * @param  mixed $instance
     */
    public function instance($abstract, $instance);

    /**
     * Resolve the given type from the container.
     *
     * @param  string $abstract
     * @param  array $parameters
     *
     * @return mixed
     */
    public function make($abstract, $parameters = []);

    /**
     * Call the given Closure and inject its dependencies.
     *
     * @param  callable|string $callback
     * @param  array $parameters
     *
     * @return mixed
     */
    public function call($callback, array $parameters = []);
}
