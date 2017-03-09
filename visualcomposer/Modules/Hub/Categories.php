<?php

namespace VisualComposer\Modules\Hub;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Class Categories
 * @package VisualComposer\Modules\Hub
 */
class Categories extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    /**
     * Categories constructor.
     */
    public function __construct()
    {
        $this->addFilter('vcv:frontend:extraOutput vcv:backend:extraOutput', 'outputCategories');

        $temporaryData = true;
        if ($temporaryData) {
            $this->wpAddAction(
                'init',
                'dummySetCategories'
            );
        }
    }

    /**
     * @param \VisualComposer\Helpers\Options $optionHelper
     */
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

    /**
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\Options $optionHelper
     *
     * @return array
     */
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
}
