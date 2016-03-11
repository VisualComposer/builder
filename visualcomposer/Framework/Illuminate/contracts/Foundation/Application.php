<?php namespace VisualComposer\Framework\Illuminate\Contracts\Foundation;

use VisualComposer\Framework\Illuminate\Contracts\Container\Container;
use VisualComposer\Framework\Illuminate\Support\ServiceProvider;

interface Application extends Container
{
    /**
     * Register a service provider with the application.
     *
     * @param  ServiceProvider|string $provider
     * @param  array $options
     * @param  bool $force
     * @return ServiceProvider
     */
    public function register($provider, $options = [], $force = false);

    /**
     * Boot the application's service providers.
     *
     * @return void
     */
    public function boot();
}
