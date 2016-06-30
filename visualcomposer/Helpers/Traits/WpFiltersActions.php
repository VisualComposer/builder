<?php

namespace VisualComposer\Helpers\Traits;

trait WpFiltersActions
{
    private function wpFilter($filterName, $methodCallback, $weight = 10, $argsCount = 100)
    {

        add_filter(
            $filterName,
            function () use ($methodCallback) {
                $args = func_get_args();

                return $this->call($methodCallback, $args);
            },
            $weight,
            $argsCount
        );
    }

    private function wpAction($actionName, $methodCallback, $weight = 10, $argsCount = 100)
    {
        add_action(
            $actionName,
            function () use ($methodCallback) {
                $args = func_get_args();

                return $this->call($methodCallback, $args);
            },
            $weight,
            $argsCount
        );
    }
}