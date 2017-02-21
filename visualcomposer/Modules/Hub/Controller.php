<?php

namespace VisualComposer\Modules\Hub;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Url;

class Controller extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    protected $elements;

    public function __construct()
    {
        $this->addFilter('vcv:frontend:extraOutput vcv:backend:extraOutput', 'outputElements');
        $this->addFilter('vcv:frontend:extraOutput vcv:backend:extraOutput', 'outputCategories');
        $this->addFilter('vcv:frontend:extraOutput vcv:backend:extraOutput', 'outputGroups');

        $temporaryData = true;
        if ($temporaryData) {
            $this->wpAddAction(
                'init',
                'dummySetElements'
            );
            $this->wpAddAction(
                'init',
                'dummySetCategories'
            );
            $this->wpAddAction(
                'init',
                'dummySetGroups'
            );
        }
    }

    protected function dummySetElements(Options $optionHelper, Url $urlHelper)
    {
        $optionHelper->set(
            'hubElements',
            [
                'row' => $urlHelper->to('public/sources/newElements/row/public/dist/element.bundle.js'),
                'column' => $urlHelper->to('public/sources/newElements/column/public/dist/element.bundle.js'),
                'textBlock' => $urlHelper->to('public/sources/newElements/textBlock/public/dist/element.bundle.js'),
            ]
        );
    }

    protected function dummySetCategories(Options $optionHelper)
    {
        $optionHelper->set(
            'hubCategories',
            [
                'Button' => [
                    'title' => 'Simple Button',
                    'elements' => [
                        'basicButton',
                        'outlineButton',
                        'gradientButton',
                        'animatedOutlineButton',
                        'doubleOutlineButton',
                    ],
                    'icon' => 'categories/icons/Button.svg',
                    'iconDark' => 'categories/iconsDark/Button.svg',
                ],
                'Row' => [
                    'title' => 'Row/Column',
                    'elements' => ['row'],
                    'icon' => 'categories/icons/Row.svg',
                    'iconDark' => 'categories/iconsDark/Row.svg',
                ],
                'Column' => [
                    'title' => 'Column',
                    'elements' => ['column'],
                    'icon' => 'categories/icons/Column.svg',
                    'iconDark' => 'categories/iconsDark/Column.svg',
                ],
                'Feature' => [
                    'title' => 'Feature',
                    'elements' => ['feature'],
                    'icon' => 'categories/icons/Feature.svg',
                    'iconDark' => 'categories/iconsDark/Feature.svg',
                ],
                'Feature section' => [
                    'title' => 'Feature Section',
                    'elements' => [],
                    'icon' => 'categories/icons/Feature.svg',
                    'iconDark' => 'categories/iconsDark/Feature.svg',
                ],
                'Section' => [
                    'title' => 'Section',
                    'elements' => [],
                    'icon' => 'categories/icons/Section.svg',
                    'iconDark' => 'categories/iconsDark/Section.svg',
                ],
                'Hero section' => [
                    'title' => 'Hero Section',
                    'elements' => ['heroSection'],
                    'icon' => 'categories/icons/Hero-Section.svg',
                    'iconDark' => 'categories/iconsDark/Hero-Section.svg',
                ],
                'Icon' => [
                    'title' => 'Icon',
                    'elements' => ['icon'],
                    'icon' => 'categories/icons/Icon.svg',
                    'iconDark' => 'categories/iconsDark/Icon.svg',
                ],
                'Single image' => [
                    'title' => 'Single Image',
                    'elements' => ['singleImage'],
                    'icon' => 'categories/icons/Single-Image.svg',
                    'iconDark' => 'categories/iconsDark/Single-Image.svg',
                ],
                'Image gallery' => [
                    'title' => 'Image Gallery',
                    'elements' => ['imageMasonryGallery', 'imageGallery'],
                    'icon' => 'categories/icons/Image-Gallery.svg',
                    'iconDark' => 'categories/iconsDark/Image-Gallery.svg',
                ],
                'Text block' => [
                    'title' => 'Text Block',
                    'elements' => ['textBlock', 'googleFontsHeading'],
                    'icon' => 'categories/icons/Text-Block.svg',
                    'iconDark' => 'categories/iconsDark/Text-Block.svg',
                ],
                'Misc' => [
                    'title' => 'Misc',
                    'elements' => ['rawHtml', 'rawJs'],
                    'icon' => 'categories/icons/Misc.svg',
                    'iconDark' => 'categories/iconsDark/Misc.svg',
                ],
                'Social' => [
                    'title' => 'Social',
                    'elements' => [
                        'twitterGrid',
                        'twitterTweet',
                        'twitterTimeline',
                        'twitterButton',
                        'flickrImage',
                        'instagramImage',
                        'googlePlusButton',
                        'pinterestPinit',
                        'facebookLike',
                    ],
                    'icon' => 'categories/icons/Social.svg',
                    'iconDark' => 'categories/iconsDark/Social.svg',
                ],
                'Videos' => [
                    'title' => 'Videos',
                    'elements' => ['youtubePlayer', 'vimeoPlayer'],
                    'icon' => 'categories/icons/Video.svg',
                    'iconDark' => 'categories/iconsDark/Video.svg',
                ],
                'WooCommerce' => [
                    'title' => 'WooCommerce',
                    'elements' => [],
                    'icon' => 'categories/icons/Misc.svg',
                    'iconDark' => 'categories/iconsDark/Misc.svg',
                ],
                'WP Widgets' => [
                    'title' => 'WP Widgets',
                    'elements' => [],
                    'icon' => 'categories/icons/WordPress.svg',
                    'iconDark' => 'categories/iconsDark/WordPress.svg',
                ],
                'Separators' => [
                    'title' => 'Separators',
                    'elements' => ['separator'],
                    'icon' => 'categories/icons/Separator.svg',
                    'iconDark' => 'categories/iconsDark/Separator.svg',
                ],
                'Maps' => [
                    'title' => 'Maps',
                    'elements' => ['googleMaps'],
                    'icon' => 'categories/icons/Map.svg',
                    'iconDark' => 'categories/iconsDark/Map.svg',
                ],
                'Grids' => [
                    'title' => 'Grids',
                    'elements' => [],
                    'icon' => 'categories/icons/Post-Grid.svg',
                    'iconDark' => 'categories/iconsDark/Post-Grid.svg',
                ],
                '_postsGridSources' => [
                    'title' => 'Post Grid Data Sources',
                    'elements' => [
                        'postsGridDataSourcePost',
                        'postsGridDataSourcePage',
                        'postsGridDataSourceCustomPostType',
                    ],
                    'icon' => 'categories/icons/Post-Grid.svg',
                    'iconDark' => 'categories/iconsDark/Post-Grid.svg',
                ],
            ]
        );
    }

    protected function dummySetGroups(Options $optionHelper)
    {
        $optionHelper->set(
            'hubGroups',
            [
                [
                    'title' => 'Basic',
                    'categories' => [
                        'Row',
                        'Column',
                        'Section',
                        'Text block',
                        'Single image',
                        'Basic video', // TODO: Check it!
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
                [
                    'title' => 'All',
                    'metaOrder' => 1,
                    'categories' => true,
                ],
            ]
        );
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
