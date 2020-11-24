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
                    // 'Single image',
                    'Empty Space',
                    'Feature',
                    'Feature section',
                    'Hero section',
                    // BC:
                    'Basic Button',
                    'Outline Button',
                    'WordPress Basic',
                    'Widgetized Sidebar',
                    'Basic Call To Action',
                    'FAQ Toggle',
                    'Separator',
                    'Social Profile Icons',
                    'Misc Basic',
                    'Simple Image Slider',
                    'Message Box Basic',
                    'Social Videos',
                ],
                'elements' => [
                    'basicButton',
                    'outlineButton',
                    'singleImage',
                    'shortcode',
                    'wpWidgetsCustom',
                    'wpWidgetsDefault',
                    'widgetizedSidebar',
                    'callToAction',
                    'faqToggle',
                    'separator',
                    'socialProfileIcons',
                    'rawHtml',
                    'rawJs',
                    'globalTemplate',
                    'simpleContactForm',
                    'basicMenu',
                    'icon',
                    'imageGallery',
                    'imageMasonryGallery',
                    'simpleImageSlider',
                    'messageBox',
                    'youtubePlayer',
                    'vimeoPlayer',
                ],
            ],
            'Media' => [
                'title' => 'Media',
                'categories' => [
                    'Single image',
                    'Image gallery',
                    'Videos',
                    // BC:
                    'Banner Element',
                    'Giphy',
                    'Images',
                    'Instagram Image',
                    'Flip Box',
                    'Icon Hover Box',
                    'Tall Hover Box',
                    'Image Masonry Gallery',
                    'Image sliders',
                    'Multiple Image Collage',
                    'Simple Image Slider',
                    'Image Galleries',
                    'Timeline Slideshow',
                    'Social Videos',
                ],
                'elements' => [
                    'bannerElement',
                    'instagramImage',
                    'flipBox',
                    'iconHoverBox',
                    'tallHoverBox',
                    'simpleImageSlider',
                    'timelineSlideshow',
                ],
            ],
            'Buttons' => [
                'title' => 'Buttons',
                'categories' => [
                    'Button',
                    // BC:
                    'Basic Button',
                    'Buttons',
                    'Button Group',
                    'Outline Button',
                ],
                'elements' => [],
            ],
            'E-Commerce' => [
                'title' => 'E-Commerce',
                'categories' => [
                    'WooCommerce',
                    'Pricing table',
                ],
                'elements' => [],
            ],
            'Containers' => [
                'title' => 'Containers',
                'categories' => [
                    'Row',
                    'Column',
                    'Section',
                    'Accordions',
                    'Tabs',
                ],
                'elements' => [],
            ],
            'Social' => [
                'title' => 'Social',
                'categories' => [
                    'Maps',
                    'Social',
                    // BC:
                    'Add To Any Share Buttons',
                    'Instagram Image',
                    'Social Profile Icons',
                ],
                'elements' => [
                    'addToAnyShareButtons',
                ],
            ],
            'Integrations' => [
                'title' => 'Integrations',
                'categories' => [
                    'Maps',
                    // BC:
                    'Soundcloud Player',
                    'Giphy',
                ],
                'elements' => [
                    'giphy',
                    'soundcloudPlayer',
                    'advancedCustomFields',
                    'calderaForms',
                    'captainForm',
                    'contactForm7',
                    'enviraGallery',
                    'essentialGrid',
                    'eventOnCalendar',
                    'gravityForms',
                    'gutenberg',
                    'mailChimpForWordPress',
                    'layerSlider',
                    'nextGenGallery',
                    'wpDataTables',
                    'ninjaForms',
                    'sliderRevolution',
                    'translatePressLanguageSwitcher',
                    'wpForms',
                ],
            ],
            'Menus' => [
                'title' => 'Menus',
                'categories' => [
                    // BC
                    'Menus',
                    'Link Dropdown',
                ],
                'elements' => [
                    'basicMenu',
                    'sandwichMenu',
                    'sandwichSideMenu',
                    'sidebarMenu',
                    'verticalSandwichMenu',
                    'linkDropdown',
                ],
            ],
            'Post Grids' => [
                'title' => 'Post Grids',
                'categories' => [
                    'Grids',
                ],
                'elements' => [],
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
