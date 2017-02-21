<?php

namespace VisualComposer\Modules\Hub;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;

class Controller extends Container implements Module
{
    use EventsFilters;

    protected $elements;

    public function __construct()
    {
        $this->addFilter('vcv:frontend:extraOutput vcv:backend:extraOutput', 'outputElements');
        $this->addFilter('vcv:frontend:extraOutput vcv:backend:extraOutput', 'outputCategories');
        $this->addFilter('vcv:frontend:extraOutput vcv:backend:extraOutput', 'outputGroups');
    }

    protected function outputElements($response, $payload, Options $optionHelper)
    {
        return array_merge(
            $response,
            [
                vcview(
                    'hub/elements',
                    [
                        'elements' => $optionHelper->get('hubElements', []),
                    ]
                ),
            ]
        );
    }

    protected function outputCategories($response, $payload, Options $optionHelper)
    {
        return array_merge(
            $response,
            [
                vcview(
                    'hub/categories',
                    [
                        'categories' => $optionHelper->get('hubCategories', []),
                    ]
                ),
            ]
        );
    }

    protected function outputGroups($response, $payload, Options $optionHelper)
    {
        return array_merge(
            $response,
            [
                vcview(
                    'hub/groups',
                    [
                        'groups' => $optionHelper->get('hubGroups', []),
                    ]
                ),
            ]
        );
    }
}
