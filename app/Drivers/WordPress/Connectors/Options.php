<?php

namespace App\Drivers\WordPress\Connectors;

use Illuminate\Contracts\Events\Dispatcher;

/**
 * Class Options
 * @package App\Drivers\WordPress\Connectors
 */
class Options
{
    /**
     * @var \Illuminate\Contracts\Events\Dispatcher
     */
    protected $event;

    /**
     * Options constructor.
     *
     * @param \Illuminate\Contracts\Events\Dispatcher $event
     */
    public function __construct(Dispatcher $event)
    {
        $this->event = $event;

        $this->event->listen(
            'driver:option:get',
            function ($optionName, $default = false) {
                $args =func_get_args();
                return get_option(VC_V_PREFIX.$optionName, $default);
            }
        );

        $this->event->listen(
            'driver:option:set',
            function ($optionName, $value) {
                update_option(VC_V_PREFIX.$optionName, $value);
            }
        );
    }
}