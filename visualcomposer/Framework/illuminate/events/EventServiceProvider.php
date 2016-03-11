<?php namespace VisualComposer\Framework\Illuminate\Events;

use VisualComposer\Framework\Illuminate\Support\ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(
            'eventsHelper',
            function ($app) {
                return (new Dispatcher($app))->setQueueResolver(
                    function () use ($app) {
                        return $app->make('VisualComposer\Framework\Illuminate\Contracts\Queue\Queue');
                    }
                );
            }
        );
    }
}
