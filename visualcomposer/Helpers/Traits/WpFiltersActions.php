<?php

namespace VisualComposer\Helpers\Traits;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

trait WpFiltersActions
{
    protected function wpAddFilter($filterName, $methodCallback, $weight = 10, $argsCount = 100)
    {
        $callback = function () use ($methodCallback, $filterName) {
            $args = func_get_args();
            $args[] = $filterName;

            /**
             * @var $this \VisualComposer\Application|\VisualComposer\Framework\Container
             * @see \VisualComposer\Framework\Container::call
             */
            return $this->call($methodCallback, $args);
        };

        add_filter(
            $filterName,
            $callback,
            $weight,
            $argsCount
        );

        return $callback;
    }

    protected function wpAddAction($actionName, $methodCallback, $priority = 10, $argsCount = 100)
    {
        $callback = function () use ($methodCallback, $actionName) {
            $args = func_get_args();
            $args[] = $actionName;

            /**
             * @var $this \VisualComposer\Application|\VisualComposer\Framework\Container
             * @see \VisualComposer\Framework\Container::call
             */
            return $this->call($methodCallback, $args);
        };

        add_action(
            $actionName,
            $callback,
            $priority,
            $argsCount
        );

        return $callback;
    }

    protected function wpRemoveFilter($filterName, $filterCallback, $priority = 10)
    {
        remove_filter($filterName, $filterCallback, $priority);
    }

    protected function wpRemoveAction($actionName, $actionCallback, $priority = 10)
    {
        remove_action($actionName, $actionCallback, $priority);
    }
}
