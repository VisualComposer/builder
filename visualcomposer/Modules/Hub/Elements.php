<?php

namespace VisualComposer\Modules\Hub;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Url;

/**
 * Class Elements
 * @package VisualComposer\Modules\Hub
 */
class Elements extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    /**
     * @var
     */
    protected $elements;

    /**
     * Elements constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\Hub\Elements::outputElements */
        $this->addFilter('vcv:frontend:head:extraOutput vcv:backend:extraOutput', 'outputElements');
        $this->addFilter('vcv:frontend:footer:extraOutput vcv:backend:extraOutput', 'outputElementsBundle', 3);

        $temporaryData = true;
        if ($temporaryData) {
            /** @see \VisualComposer\Modules\Hub\Elements::dummySetElements */
            $this->wpAddAction(
                'init',
                'dummySetElements'
            );
        }
    }

    /**
     * @param \VisualComposer\Helpers\Options $optionHelper
     * @param \VisualComposer\Helpers\Url $urlHelper
     */
    protected function dummySetElements(Options $optionHelper, Url $urlHelper)
    {
        $optionHelper->set(
            'hubElements',
            [
                'row' => [
                    'bundlePath' => $urlHelper->to('public/sources/newElements/row/public/dist/element.bundle.js'),
                    'elementPath' => $urlHelper->to('public/sources/newElements/row/row/'),
                    'assetsPath' => $urlHelper->to('public/sources/newElements/row/row/public/'),
                    'settings' => [
                        'name' => 'Row',
                        'metaThumbnailUrl' => $urlHelper->to(
                            'public/sources/newElements/row/row/public/thumbnail-row-column.png'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                            'public/sources/newElements/row/row/public/preview-row-column.jpg'
                        ),
                        'metaDescription' => 'This is TODO Change text for description',
                    ],
                ],
                'column' => [
                    'bundlePath' => $urlHelper->to('public/sources/newElements/column/public/dist/element.bundle.js'),
                    'elementPath' => $urlHelper->to('public/sources/newElements/column/column/'),
                    'assetsPath' => $urlHelper->to('public/sources/newElements/column/column/public/'),
                    'settings' => [
                        'name' => 'Column',
                        'metaThumbnailUrl' => '',
                        'metaPreviewUrl' => '',
                        'metaDescription' => '',
                    ],
                ],
                'textBlock' => [
                    'bundlePath' => $urlHelper->to(
                        'public/sources/newElements/textBlock/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('public/sources/newElements/textBlock/textBlock/'),
                    'assetsPath' => $urlHelper->to('public/sources/newElements/textBlock/textBlock/public'),
                    'settings' => [
                        'name' => 'Text Block',
                        'metaThumbnailUrl' => $urlHelper->to(
                            'public/sources/newElements/textBlock/textBlock/public/thumbnail-text-block.png'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                            'public/sources/newElements/textBlock/textBlock/public/preview-text-block.jpg'
                        ),
                        'metaDescription' => 'This is TODO Change text for description',
                    ],
                ],
                'basicButton' => [
                    'bundlePath' => $urlHelper->to(
                        'public/sources/newElements/basicButton/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('public/sources/newElements/basicButton/basicButton/'),
                    'assetsPath' => $urlHelper->to('public/sources/newElements/basicButton/basicButton/public/'),
                    'settings' => [
                        'name' => 'Basic Button',
                        'metaThumbnailUrl' => $urlHelper->to(
                            'public/sources/newElements/basicButton/basicButton/public/thumbnail-basic-button.png'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                            'public/sources/newElements/basicButton/basicButton/public/preview-basic-button.png'
                        ),
                        'metaDescription' => 'This is TODO Change text for description',
                    ],
                ],
                //                'animatedOutlineButton' => [
                //                    'bundlePath' => $urlHelper->to(
                //                        'public/sources/newElements/animatedOutlineButton/public/dist/element.bundle.js'
                //                    ),
                //                    'elementPath' => $urlHelper->to('public/sources/newElements/animatedOutlineButton/animatedOutlineButton/'),
                //                    'assetsPath' => $urlHelper->to('public/sources/newElements/animatedOutlineButton/animatedOutlineButton/public/'),
                //                    'settings' => [
                //                        'name' => 'Animated Outline Button',
                //                        'metaThumbnailUrl' => $urlHelper->to(
                //                            'public/sources/newElements/animatedOutlineButton/animatedOutlineButton/public/animated-outline-button-thumbnail.jpg'
                //                        ),
                //                        'metaPreviewUrl' => $urlHelper->to(
                //                            'public/sources/newElements/animatedOutlineButton/animatedOutlineButton/public/animated-outline-button-preview.jpg'
                //                        ),
                //                        'metaDescription' => 'This is TODO Change text for description',
                //                    ],
                //                ],
                'outlineButton' => [
                    'bundlePath' => $urlHelper->to(
                        'public/sources/newElements/outlineButton/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('public/sources/newElements/outlineButton/outlineButton/'),
                    'assetsPath' => $urlHelper->to('public/sources/newElements/outlineButton/outlineButton/public/'),
                    'settings' => [
                        'name' => 'Outline Button',
                        'metaThumbnailUrl' => $urlHelper->to(
                            'public/sources/newElements/outlineButton/outlineButton/public/outline-button-thumbnail.png'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                            'public/sources/newElements/outlineButton/outlineButton/public/outline-button-preview.jpg'
                        ),
                        'metaDescription' => 'This is TODO Change text for description',
                    ],
                ],
                'youtubePlayer' => [
                    'bundlePath' => $urlHelper->to(
                        'public/sources/newElements/youtubePlayer/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('public/sources/newElements/youtubePlayer/youtubePlayer/'),
                    'assetsPath' => $urlHelper->to('public/sources/newElements/youtubePlayer/youtubePlayer/public/'),
                    'settings' => [
                        'name' => 'Youtube Player',
                        'metaThumbnailUrl' => $urlHelper->to(
                            'public/sources/newElements/youtubePlayer/youtubePlayer/public/youtube-player-thumbnail.png'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                            'public/sources/newElements/youtubePlayer/youtubePlayer/public/youtube-player-preview.jpg'
                        ),
                        'metaDescription' => 'This is TODO Change text for description',
                    ],
                ],
                'singleImage' => [
                    'bundlePath' => $urlHelper->to(
                        'public/sources/newElements/singleImage/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('public/sources/newElements/singleImage/singleImage/'),
                    'assetsPath' => $urlHelper->to('public/sources/newElements/singleImage/singleImage/public/'),
                    'settings' => [
                        'name' => 'Single Image',
                        'metaThumbnailUrl' => $urlHelper->to(
                            'public/sources/newElements/singleImage/singleImage/public/thumbnail-single-image.png'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                            'public/sources/newElements/singleImage/singleImage/public/preview-single-image.jpg'
                        ),
                        'metaDescription' => 'This is TODO Change text for description',
                    ],
                ],
                'heroSection' => [
                    'bundlePath' => $urlHelper->to(
                        'public/sources/newElements/heroSection/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('public/sources/newElements/heroSection/heroSection/'),
                    'assetsPath' => $urlHelper->to('public/sources/newElements/heroSection/heroSection/public/'),
                    'settings' => [
                        'name' => 'Hero Section',
                        'metaThumbnailUrl' => $urlHelper->to(
                            'public/sources/newElements/heroSection/heroSection/public/thumbnail-hero-section.jpg'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                            'public/sources/newElements/heroSection/heroSection/public/preview-hero-section.jpg'
                        ),
                        'metaDescription' => 'This is TODO Change text for description',
                    ],
                ],
                'icon' => [
                    'bundlePath' => $urlHelper->to(
                        'public/sources/newElements/icon/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('public/sources/newElements/icon/icon/'),
                    'assetsPath' => $urlHelper->to('public/sources/newElements/icon/icon/public/'),
                    'settings' => [
                        'name' => 'Icon',
                        'metaThumbnailUrl' => $urlHelper->to(
                            'public/sources/newElements/icon/icon/public/thumbnail-icon.jpg'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                            'public/sources/newElements/icon/icon/public/preview-icon.jpg'
                        ),
                        'metaDescription' => 'This is TODO Change text for description',
                    ],
                ],
                'googleFontsHeading' => [
                    'bundlePath' => $urlHelper->to(
                        'public/sources/newElements/googleFontsHeading/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to(
                        'public/sources/newElements/googleFontsHeading/googleFontsHeading/'
                    ),
                    'assetsPath' => $urlHelper->to(
                        'public/sources/newElements/googleFontsHeading/googleFontsHeading/public/'
                    ),
                    'settings' => [
                        'name' => 'Google Fonts Heading',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'public/sources/newElements/googleFontsHeading/googleFontsHeading/public/google-fonts-thumbnail.png'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'public/sources/newElements/googleFontsHeading/googleFontsHeading/public/google-fonts-preview.png'
                        ),
                        'metaDescription' => 'This is TODO Change text for description',
                    ],
                ],
                'wpWidgetsCustom' => [
                    'bundlePath' => $urlHelper->to(
                        'public/sources/newElements/wpWidgetsCustom/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to(
                        'public/sources/newElements/wpWidgetsCustom/wpWidgetsCustom/'
                    ),
                    'assetsPath' => $urlHelper->to(
                        'public/sources/newElements/wpWidgetsCustom/wpWidgetsCustom/public/'
                    ),
                    'settings' => [
                        'name' => 'Wordpress Custom Widget',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'public/sources/newElements/wpWidgetsCustom/wpWidgetsCustom/public/custom-widgets-thumbnail.png'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'public/sources/newElements/wpWidgetsCustom/wpWidgetsCustom/public/custom-widgets-preview.png'
                        ),
                        'metaDescription' => 'This is TODO Change text for description',
                    ],
                ],
                'wpWidgetsDefault' => [
                    'bundlePath' => $urlHelper->to(
                        'public/sources/newElements/wpWidgetsDefault/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to(
                        'public/sources/newElements/wpWidgetsDefault/wpWidgetsDefault/'
                    ),
                    'assetsPath' => $urlHelper->to(
                        'public/sources/newElements/wpWidgetsDefault/wpWidgetsDefault/public/'
                    ),
                    'settings' => [
                        'name' => 'Wordpress Default Widget',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'public/sources/newElements/wpWidgetsDefault/wpWidgetsDefault/public/wordpress-widgets-thumbnail.png'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'public/sources/newElements/wpWidgetsDefault/wpWidgetsDefault/public/wordpress-widgets-preview.png'
                        ),
                        'metaDescription' => 'This is TODO Change text for description',
                    ],
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

    /**
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\Options $optionHelper
     *
     * @return array
     */
    protected function outputElementsBundle($response, $payload, Options $optionHelper)
    {
        return array_merge(
            $response,
            [
                vcview(
                    'hub/elementsBundle',
                    [
                        'elements' => $optionHelper->get('hubElements', []),
                    ]
                ),
            ]
        );
    }
}
