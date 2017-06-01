<?php

namespace VisualComposer\Modules\Development;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Class Groups
 * @package VisualComposer\Modules\Hub
 */
class HubGroups extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    /**
     * Groups constructor.
     */
    public function __construct()
    {
        if (vcvenv('VCV_ENV_DEV_CATEGORIES')) {
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
                'All' => [
                    'title' => 'All',
                    'metaOrder' => 1,
                    'categories' => true,
                ],
                'Basic' => [
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
                'Media' => [
                    'title' => 'Media',
                    'categories' => [
                        'Image gallery',
                        'Image sliders',
                        'Single image',
                        'Videos',
                    ],
                ],
                'Containers' => [
                    'title' => 'Containers',
                    'categories' => [
                        'Tabs',
                        'Tours',
                        'Accordions',
                        'Row',
                        'Section',
                    ],
                ],
                'Social' => [
                    'title' => 'Social',
                    'categories' => ['Social'],
                ],
                'Wordpress' => [
                    'title' => 'Wordpress',
                    'categories' => ['Wordpress'],
                ],
                'Content' => [
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
                'WooCommerce' => [
                    'title' => 'WooCommerce',
                    'categories' => ['WooCommerce'],
                ],
                'WP Widgets' => [
                    'title' => 'WP Widgets',
                    'categories' => ['WP Widgets'],
                ],
            ]
        );
    }
}
