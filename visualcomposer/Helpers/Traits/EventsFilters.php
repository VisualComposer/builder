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
    private function addFilter($filterName, $methodCallback, $weight = 0, $extraPayload = [])
    {
        /** @var Filters $filterHelper */
        $filterHelper = vchelper('Filters');
        $filterHelper->listen(
            $filterName,
            function () use ($methodCallback, $extraPayload) {
                $args = func_get_args();
                if (!empty($extraPayload)) {
                    foreach ($extraPayload as $key => $value) {
                        if (is_numeric($key)) {
                            $args[] = $value;
                        } else {
                            $args[ $key ] = $value;
                        }
                    }
                }

                /**
                 * @var $this \VisualComposer\Application|\VisualComposer\Framework\Container
                 * @see \VisualComposer\Framework\Container::call
                 */
                return $this->call($methodCallback, $args);
            },
            $weight
        );
    }

    private function addEvent($eventName, $methodCallback, $weight = 0, $extraPayload = [])
    {
        /** @var Events $filter */
        $eventHelper = vchelper('Events');
        $eventHelper->listen(
            $eventName,
            function () use ($methodCallback, $extraPayload) {
                $args = func_get_args();
                if (!empty($extraPayload)) {
                    foreach ($extraPayload as $key => $value) {
                        if (is_numeric($key)) {
                            $args[] = $value;
                        } else {
                            $args[ $key ] = $value;
                        }
                    }
                }

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
