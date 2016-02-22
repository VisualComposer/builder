<?php

namespace App\Drivers\WordPress\Connectors;

use Illuminate\Contracts\Events\Dispatcher;

/**
 * Class Locale
 * @package App\Drivers\WordPress\Connectors
 */
class Locale
{
    /**
     * List of used languages keys for translation
     * @var array
     */
    protected $locale = [];

    /**
     * Event listener/fire
     * @var \Illuminate\Contracts\Events\Dispatcher
     */
    protected $event;

    /**
     * Initializes base locale array
     * Locale constructor.
     *
     * @param \Illuminate\Contracts\Events\Dispatcher $event
     */
    public function __construct(Dispatcher $event)
    {
        $this->locale = [
            'edit_with_vc' => __('Edit with VC 5', 'vc5'),
        ];

        $this->event = $event;
        $this->event->listen('driver:locale:get', [$this, 'get']);
    }

    /**
     * Getter for locale
     *
     * @param $key
     *
     * @return bool
     */
    public function get($key)
    {
        return $this->locale[$key] ?: false;
    }
}