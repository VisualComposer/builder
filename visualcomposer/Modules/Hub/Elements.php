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
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Row and Column are the basic structural element for building an initial content structure by adding rows and dividing them into columns. You can insert other content elements into columns.',
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
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Simple text editor for working with static text, including paragraphs, titles, bullets and even media. Simple text block is a copy of default WordPress editor.',
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
                        'metaDescription' => 'Basic flat style button with hover effect to catch visitor\'s attention.',
                    ],
                ],
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
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Simple outline button with solid fill on hover. Great solution to be used as a secondary button within a website.',
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
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'YouTube player allows you to display video from YouTube on your website by simply copy/paste link to the video.',
                    ],
                ],
                'vimeoPlayer' => [
                    'bundlePath' => $urlHelper->to(
                        'public/sources/newElements/vimeoPlayer/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('public/sources/newElements/vimeoPlayer/vimeoPlayer/'),
                    'assetsPath' => $urlHelper->to('public/sources/newElements/vimeoPlayer/vimeoPlayer/public/'),
                    'settings' => [
                        'name' => 'Vimeo Player',
                        'metaThumbnailUrl' => $urlHelper->to(
                            'public/sources/newElements/vimeoPlayer/vimeoPlayer/public/vimeo-player-thumbnail.png'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                            'public/sources/newElements/vimeoPlayer/vimeoPlayer/public/vimeo-player-preview.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Vimeo player allows you to display video from Vimeo on your website by simply copy/paste link to the video.',
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
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Single image is a basic element for adding images from Media Library into the content area. Single image element includes controls for image manipulations.',
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
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Hero section with image background and \'Call to Action\' message with a switchable button and position controls.',
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
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Simple icon element with various icons from library and background shape control options.',
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
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Selected Google Fonts with additional styling allows adding eye-catching titles and call to action messages.',
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
                        'metaDescription' => 'Choose, configure and add custom widgets to your site.',
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
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Choose, configure and add any of WordPress default widgets to your site.',
                    ],
                ],
                //'shortcode' => [
                //    'bundlePath' => $urlHelper->to(
                //        'public/sources/newElements/shortcode/public/dist/element.bundle.js'
                //    ),
                //    'elementPath' => $urlHelper->to('public/sources/newElements/shortcode/shortcode/'),
                //    'assetsPath' => $urlHelper->to('public/sources/newElements/shortcode/shortcode/public/'),
                //    'settings' => [
                //        'name' => 'Shortcode',
                //        'metaThumbnailUrl' => $urlHelper->to(
                //            'public/sources/newElements/shortcode/shortcode/public/shortcode-thumbnail.png'
                //        ),
                //        'metaPreviewUrl' => $urlHelper->to(
                //            'public/sources/newElements/shortcode/shortcode/public/shortcode-preview.png'
                //        ),
                //        // @codingStandardsIgnoreLine
                //        'metaDescription' => 'Add any shortcode available on your WordPress site to the layout.',
                //    ],
                //],
            ]
        );
        // 'animatedOutlineButton' => [
        //   'bundlePath' => $urlHelper->to(
        //       'public/sources/newElements/animatedOutlineButton/public/dist/element.bundle.js'
        //   ),
        //   'elementPath' => $urlHelper->to('public/sources/newElements/animatedOutlineButton/animatedOutlineButton/'),
        // @codingStandardsIgnoreLine
        //   'assetsPath' => $urlHelper->to('public/sources/newElements/animatedOutlineButton/animatedOutlineButton/public/'),
        //   'settings' => [
        //       'name' => 'Animated Outline Button',
        //       'metaThumbnailUrl' => $urlHelper->to(
        //           'public/sources/newElements/animatedOutlineButton/animatedOutlineButton/public/animated-outline-button-thumbnail.jpg'
        //       ),
        //       'metaPreviewUrl' => $urlHelper->to(
        //           'public/sources/newElements/animatedOutlineButton/animatedOutlineButton/public/animated-outline-button-preview.jpg'
        //       ),
        //       'metaDescription' => 'Underline-to-outline button with smooth transition effect for hover state.',
        //   ],
        // ],
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
