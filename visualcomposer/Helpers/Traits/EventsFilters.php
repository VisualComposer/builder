<?php

namespace VisualComposer\Helpers\Traits;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Helpers\Events;
use VisualComposer\Helpers\Filters;

trait EventsFilters
{
    private function addFilter($filterName, $methodCallback, $weight = 0)
    {
        /** @var Filters $filterHelper */
        $filterHelper = vchelper('Filters');
        $filterHelper->listen(
            $filterName,
            function () use ($methodCallback, $filterName) {
                $args = func_get_args();
                $args[] = $filterName;

                /**
                 * @var $this \VisualComposer\Application|\VisualComposer\Framework\Container
                 * @see \VisualComposer\Framework\Container::call
                 */
                return $this->call($methodCallback, $args);
            },
            $weight
        );
    }

    private function addEvent($eventName, $methodCallback, $weight = 0)
    {
        /** @var Events $filter */
        $eventHelper = vchelper('Events');
        $eventHelper->listen(
            $eventName,
            function () use ($methodCallback, $eventName) {
                $args = func_get_args();
                $args[] = $eventName;

                /**
                 * @var $this \VisualComposer\Application|\VisualComposer\Framework\Container
                 * @see \VisualComposer\Framework\Container::call
                 */
                return $this->call($methodCallback, $args);
            },
            $weight
        );
    }
}
