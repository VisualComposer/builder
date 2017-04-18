<?php

namespace VisualComposer\Modules\Hub;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Assets;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Url;

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
        /** @see \VisualComposer\Modules\Hub\Categories::outputCategories */
        $this->addFilter('vcv:frontend:body:extraOutput vcv:backend:extraOutput', 'outputCategories');

        $temporaryData = true;
        if ($temporaryData) {
            /** @see \VisualComposer\Modules\Hub\Categories::dummySetCategories */
            $this->wpAddAction(
                'init',
                'dummySetCategories'
            );
        }
    }

    /**
     * @param \VisualComposer\Helpers\Options $optionHelper
     * @param \VisualComposer\Helpers\Url $urlHelper
     */
    protected function dummySetCategories(Options $optionHelper, Url $urlHelper)
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
                    'icon' => $urlHelper->to('public/sources/newCategories/icons/Button.svg'),
                    'iconDark' => $urlHelper->to('public/sources/newCategories/iconsDark/Button.svg'),
                ],
                'Row' => [
                    'title' => 'Row/Column',
                    'elements' => ['row'],
                    'icon' => $urlHelper->to('public/sources/newCategories/icons/Row.svg'),
                    'iconDark' => $urlHelper->to('public/sources/newCategories/iconsDark/Row.svg'),
                ],
                'Column' => [
                    'title' => 'Column',
                    'elements' => ['column'],
                    'icon' => $urlHelper->to('public/sources/newCategories/icons/Column.svg'),
                    'iconDark' => $urlHelper->to('public/sources/newCategories/iconsDark/Column.svg'),
                ],
                'Feature' => [
                    'title' => 'Feature',
                    'elements' => ['feature'],
                    'icon' => $urlHelper->to('public/sources/newCategories/icons/Feature.svg'),
                    'iconDark' => $urlHelper->to('public/sources/newCategories/iconsDark/Feature.svg'),
                ],
                'Feature section' => [
                    'title' => 'Feature Section',
                    'elements' => [],
                    'icon' => $urlHelper->to('public/sources/newCategories/icons/Feature.svg'),
                    'iconDark' => $urlHelper->to('public/sources/newCategories/iconsDark/Feature.svg'),
                ],
                'Section' => [
                    'title' => 'Section',
                    'elements' => [],
                    'icon' => $urlHelper->to('public/sources/newCategories/icons/Section.svg'),
                    'iconDark' => $urlHelper->to('public/sources/newCategories/iconsDark/Section.svg'),
                ],
                'Hero section' => [
                    'title' => 'Hero Section',
                    'elements' => ['heroSection'],
                    'icon' => $urlHelper->to('public/sources/newCategories/icons/Hero-Section.svg'),
                    'iconDark' => $urlHelper->to('public/sources/newCategories/iconsDark/Hero-Section.svg'),
                ],
                'Icon' => [
                    'title' => 'Icon',
                    'elements' => ['icon'],
                    'icon' => $urlHelper->to('public/sources/newCategories/icons/Icon.svg'),
                    'iconDark' => $urlHelper->to('public/sources/newCategories/iconsDark/Icon.svg'),
                ],
                'Single image' => [
                    'title' => 'Single Image',
                    'elements' => ['singleImage'],
                    'icon' => $urlHelper->to('public/sources/newCategories/icons/Single-Image.svg'),
                    'iconDark' => $urlHelper->to('public/sources/newCategories/iconsDark/Single-Image.svg'),
                ],
                'Image gallery' => [
                    'title' => 'Image Gallery',
                    'elements' => ['imageMasonryGallery', 'imageGallery'],
                    'icon' => $urlHelper->to('public/sources/newCategories/icons/Image-Gallery.svg'),
                    'iconDark' => $urlHelper->to('public/sources/newCategories/iconsDark/Image-Gallery.svg'),
                ],
                'Text block' => [
                    'title' => 'Text Block',
                    'elements' => ['textBlock', 'googleFontsHeading'],
                    'icon' => $urlHelper->to('public/sources/newCategories/icons/Text-Block.svg'),
                    'iconDark' => $urlHelper->to('public/sources/newCategories/iconsDark/Text-Block.svg'),
                ],
                'Misc' => [
                    'title' => 'Misc',
                    'elements' => ['rawHtml', 'rawJs'],
                    'icon' => $urlHelper->to('public/sources/newCategories/icons/Misc.svg'),
                    'iconDark' => $urlHelper->to('public/sources/newCategories/iconsDark/Misc.svg'),
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
                    'icon' => $urlHelper->to('public/sources/newCategories/icons/Social.svg'),
                    'iconDark' => $urlHelper->to('public/sources/newCategories/iconsDark/Social.svg'),
                ],
                'Videos' => [
                    'title' => 'Videos',
                    'elements' => ['youtubePlayer', 'vimeoPlayer'],
                    'icon' => $urlHelper->to('public/sources/newCategories/icons/Video.svg'),
                    'iconDark' => $urlHelper->to('public/sources/newCategories/iconsDark/Video.svg'),
                ],
                'WooCommerce' => [
                    'title' => 'WooCommerce',
                    'elements' => [],
                    'icon' => $urlHelper->to('public/sources/newCategories/icons/Misc.svg'),
                    'iconDark' => $urlHelper->to('public/sources/newCategories/iconsDark/Misc.svg'),
                ],
                'WP Widgets' => [
                    'title' => 'WP Widgets',
                    'elements' => ['wpWidgetsCustom', 'wpWidgetsDefault'],
                    'icon' => $urlHelper->to('public/sources/newCategories/icons/WordPress.svg'),
                    'iconDark' => $urlHelper->to('public/sources/newCategories/iconsDark/WordPress.svg'),
                ],
                'Separators' => [
                    'title' => 'Separators',
                    'elements' => ['separator'],
                    'icon' => $urlHelper->to('public/sources/newCategories/icons/Separator.svg'),
                    'iconDark' => $urlHelper->to('public/sources/newCategories/iconsDark/Separator.svg'),
                ],
                'Maps' => [
                    'title' => 'Maps',
                    'elements' => ['googleMaps'],
                    'icon' => $urlHelper->to('public/sources/newCategories/icons/Map.svg'),
                    'iconDark' => $urlHelper->to('public/sources/newCategories/iconsDark/Map.svg'),
                ],
                'Grids' => [
                    'title' => 'Grids',
                    'elements' => [],
                    'icon' => $urlHelper->to('public/sources/newCategories/icons/Post-Grid.svg'),
                    'iconDark' => $urlHelper->to('public/sources/newCategories/iconsDark/Post-Grid.svg'),
                ],
                '_postsGridSources' => [
                    'title' => 'Post Grid Data Sources',
                    'elements' => [
                        'postsGridDataSourcePost',
                        'postsGridDataSourcePage',
                        'postsGridDataSourceCustomPostType',
                    ],
                    'icon' => $urlHelper->to('public/sources/newCategories/icons/Post-Grid.svg'),
                    'iconDark' => $urlHelper->to('public/sources/newCategories/iconsDark/Post-Grid.svg'),
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
