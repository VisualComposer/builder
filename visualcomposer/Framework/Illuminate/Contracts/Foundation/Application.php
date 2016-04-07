<?php namespace VisualComposer\Framework\Illuminate\Contracts\Foundation;

use VisualComposer\Framework\Illuminate\Contracts\Container\Container;

/**
 * Interface Application
 */
interface Application extends Container
{
    /**
     * Boot the application's service providers
     *
     * @return void
     */
    public function boot();
}
