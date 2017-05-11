<?php

namespace VisualComposer\Modules\Hub;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Hub;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Class Groups
 * @package VisualComposer\Modules\Hub
 */
class Groups extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    /**
     * Groups constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\Hub\Groups::outputGroups */
        $this->addFilter('vcv:frontend:body:extraOutput vcv:backend:extraOutput', 'outputGroups');

        $temporaryData = false;
        if ($temporaryData) {
            /** @see \VisualComposer\Modules\Hub\Groups::dummySetGroups */
            $this->wpAddAction(
                'init',
                'dummySetGroups'
            );
        }
    }

    /**
     * @param \VisualComposer\Helpers\Options $optionHelper
     */
    protected function dummySetGroups(Options $optionHelper)
    {
        $optionHelper->set(
            'hubGroups',
            [
                [
                    'title' => 'All',
                    'metaOrder' => 1,
                    'categories' => true,
                ],
                [
                    'title' => 'Basic',
                    'categories' => [
                        'Row',
                        'Column',
                        'Section',
                        'Text block',
                        'Single image',
                        'Button',
                    ],
                ],
                [
                    'title' => 'Media',
                    'categories' => [
                        'Image gallery',
                        'Image sliders',
                        'Single image',
                        'Videos',
                    ],
                ],
                [
                    'title' => 'Containers',
                    'categories' => [
                        'Tabs',
                        'Tours',
                        'Accordions',
                        'Row',
                        'Section',
                    ],
                ],
                [
                    'title' => 'Social',
                    'categories' => ['Social'],
                ],
                [
                    'title' => 'Wordpress',
                    'categories' => ['Wordpress'],
                ],
                [
                    'title' => 'Content',
                    'categories' => [
                        'Hero section',
                        'Icon',
                        'Single image',
                        'Text Block',
                        'Feature',
                        'Maps',
                        'Separators',
                        'Grids',
                        'Feature section',
                    ],
                ],
                [
                    'title' => 'WooCommerce',
                    'categories' => ['WooCommerce'],
                ],
                [
                    'title' => 'WP Widgets',
                    'categories' => ['WP Widgets'],
                ],
            ]
        );
    }

    /**
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\Hub $hubHelper
     *
     * @return array
     */
    protected function outputGroups($response, $payload, Hub $hubHelper)
    {
        return array_merge(
            $response,
            [
                vcview(
                    'hub/groups',
                    [
                        'groups' => array_values($hubHelper->getGroups()),
                    ]
                ),
            ]
        );
    }
}
