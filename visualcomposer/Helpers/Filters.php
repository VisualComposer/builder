<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Helpers\Events as EventsDispatcher;

/**
 * Interface Dispatcher.
 */
interface Filters extends EventsDispatcher
{
    /**
     * Fire an event and call the listeners.
     *
     * @param  string $filter
     * @param string $body
     * @param  mixed $payload
     * @param bool $haltable
     *
     * @return array|null
     */
    public function fire($filter, $body = '', $payload = [], $haltable = false);

    /**
     * Return last called filter
     *
     * @return string|null
     */
    public function firing();
}
