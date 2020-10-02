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
            'Basic' => [
                'title' => 'Basic',
                'categories' => [
                    'Row',
                    'Text block',
                    'Basic Button',
                    'Outline Button',
                    'Single image',
                    'WordPress Basic',
                    'Widgetized Sidebar',
                    'Empty Space',
                    'Basic Call To Action',
                    'FAQ Toggle',
                    'Separator',
                    'Social Profile Icons',
                    'Feature',
                    'Feature section',
                    'Misc Basic',
                    'Hero section',
                    'Icon',
                    'Image Gallery',
                    'Image Masonry Gallery',
                    'Simple Image Slider',
                    'Message Box Basic',
                    'Social Videos'
                ],
            ],
            'Media' => [
                'title' => 'Media',
                'categories' => [
                    'Single image',
                    'Banner Element',
                    'Giphy',
                    'Images',
                    'Instagram Image',
                    'Flip Box',
                    'Icon Hover Box',
                    'Tall Hover Box',
                    'Image Gallery',
                    'Image Masonry Gallery',
                    'Multiple Image Collage',
                    'Image Galleries',
                    'Simple Image Slider',
                    'Timeline Slideshow',
                    'Social Videos',
                    'Videos'
                ],
            ],
            'Buttons' => [
                'title' => 'Buttons',
                'categories' => [
                    'Basic Button',
                    'Outline Button',
                    'Buttons',
                    'Button Group'
                ],
            ],
            'E-Commerce' => [
                'title' => 'E-Commerce',
                'categories' => [
                    'WooCommerce',
                    'Pricing table'
                ],
            ],
            'Containers' => [
                'title' => 'Containers',
                'categories' => [
                    'Row',
                    'Section',
                    'Accordions',
                    'Tabs'
                ],
            ],
            'Social' => [
                'title' => 'Social',
                'categories' => [
                    'Add To Any Share Buttons',
                    'Maps',
                    'Instagram Image',
                    'Social Profile Icons',
                    'Social'
                ],
            ],
            'Integrations' => [
                'title' => 'Integrations',
                'categories' => [
                    'WordPress',
                    'Maps',
                    'Giphy',
                    'Soundcloud Player'
                ],
            ],
            'Menus' => [
                'title' => 'Menus',
                'categories' => [
                    'Menus',
                    'Link Dropdown'
                ],
            ],
            'Post Grids' => [
                'title' => 'Post Grids',
                'categories' => [
                    'Grids'
                ],
            ],
            'Other' => [
                'title' => 'Other',
                'categories' => [
                    'Heading Elements',
                    'Link Dropdown',
                    'Headers & Footers',
                    'Testimonial',
                    'Button Group',
                    'Widgetized Sidebar',
                    'Simple Search',
                    'Counter',
                    'Charts',
                    'Call To Action',
                    'Feature Description',
                    'Outline FAQ Toggle',
                    'FAQ Group',
                    'Separators',
                    'Flip Box',
                    'Hover Box',
                    'Icon Hover Box',
                    'Misc',
                    'Icon Group',
                    'Multiple Image Collage',
                    'Logo Slider',
                    'Message Box'
                ],
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
            if (isset($new['categories']) && is_array($new['categories']) && isset($prev['categories'])) {
                $merged['categories'] = array_values(
                    $dataHelper->arrayDeepUnique(array_merge($prev['categories'], $new['categories']))
                );
            }
        }

        return $merged;
    }
}
