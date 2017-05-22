<?php

namespace VisualComposer\Helpers\Traits;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

trait WpFiltersActions
{
    private function wpAddFilter($filterName, $methodCallback, $weight = 10, $argsCount = 100)
    {

        add_filter(
            $filterName,
            function () use ($methodCallback) {
                $args = func_get_args();

                /**
                 * @var $this \VisualComposer\Application|\VisualComposer\Framework\Container
                 * @see \VisualComposer\Framework\Container::call
                 */
                return $this->call($methodCallback, $args);
            },
            $weight,
            $argsCount
        );
    }

    private function wpAddAction($actionName, $methodCallback, $priority = 10, $argsCount = 100)
    {
        add_action(
            $actionName,
            function () use ($methodCallback) {
                $args = func_get_args();

                /**
                 * @var $this \VisualComposer\Application|\VisualComposer\Framework\Container
                 * @see \VisualComposer\Framework\Container::call
                 */
                return $this->call($methodCallback, $args);
            },
            $priority,
            $argsCount
        );
    }
}
