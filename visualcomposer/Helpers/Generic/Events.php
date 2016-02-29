<?php
namespace VisualComposer\Helpers\Generic;

abstract class Events
{
    /**
     * @return \Illuminate\Contracts\Events\Dispatcher
     */
    public static function getEventManager()
    {
        return app('events');
    }
}