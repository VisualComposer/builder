<?php

namespace VisualComposer\Helpers\Hub;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;

class Groups implements Helper
{
    public function getGroups()
    {
        return [
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
                    'Feature Description'
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
        ];
    }

    public function setGroups($groups = [])
    {
        $optionHelper = vchelper('Options');

        return $optionHelper->set('hubGroups', $groups);
    }

    public function updateGroup($key, $prev, $new, $merged)
    {
        $dataHelper = vchelper('Data');
        if (!empty($prev)) {
            if (isset($new['categories']) && is_array($new['categories']) && isset($prev['categories'])
            ) {
                $merged['categories'] = array_values(
                    $dataHelper->arrayDeepUnique(array_merge($prev['categories'], $new['categories']))
                );
            }
        }

        return $merged;
    }
}
