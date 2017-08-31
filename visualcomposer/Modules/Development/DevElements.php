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
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Url;

class DevElements extends Container implements Module
{
    use WpFiltersActions;

    public function __construct()
    {
        if (vcvenv('VCV_ENV_DEV_ELEMENTS')) {
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
                //'demoElement' => [
                //    'bundlePath' => $urlHelper->to(
                //        'devElements/demoElement/public/dist/element.bundle.js'
                //    ),
                //    'elementPath' => $urlHelper->to('devElements/demoElement/demoElement/'),
                //    'elementRealPath' => vcapp()->path('devElements/demoElement/demoElement/'),
                //    'assetsPath' => $urlHelper->to(
                //        'devElements/demoElement/demoElement/public/'
                //    ),
                //    'settings' => [
                //        'name' => 'Demo Element',
                //        // 'metaThumbnailUrl' => $urlHelper->to(
                //        // @codingStandardsIgnoreLine
                //            // 'devElements/demoElement/demoElement/public/demo-element-thumbnail.png'
                //        // ),
                //        // 'metaPreviewUrl' => $urlHelper->to(
                //        // @codingStandardsIgnoreLine
                //            // 'devElements/googleFontsHeading/googleFontsHeading/public/demo-element-preview.png'
                //        // ),
                //        // @codingStandardsIgnoreLine
                //        'metaDescription' => 'This is just a demo element.',
                //    ],
                //],
                'section' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/section/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/section/section/'),
                    'elementRealPath' => vcapp()->path('devElements/section/section/'),
                    'assetsPath' => $urlHelper->to(
                        'devElements/section/section/public/'
                    ),
                    'settings' => [
                        'name' => 'Section',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/section/section/public/thumbnail-section.png'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/section/section/public/preview-section.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Section is an optional root element which can be used to group rows in order to apply joint background.',
                    ],
                ],
                'row' => [
                    'bundlePath' => $urlHelper->to('devElements/row/public/dist/element.bundle.js'),
                    'elementPath' => $urlHelper->to('devElements/row/row/'),
                    'elementRealPath' => vcapp()->path('devElements/row/row/'),
                    'assetsPath' => $urlHelper->to('devElements/row/row/public/'),
                    'settings' => [
                        'name' => 'Row',
                        'metaThumbnailUrl' => $urlHelper->to(
                            'devElements/row/row/public/thumbnail-row-column.png'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                            'devElements/row/row/public/preview-row-column.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Row and Column are the basic structural element for building an initial content structure by adding rows and dividing them into columns. You can insert other content elements into columns.',
                    ],
                ],
                'column' => [
                    'bundlePath' => $urlHelper->to('devElements/column/public/dist/element.bundle.js'),
                    'elementPath' => $urlHelper->to('devElements/column/column/'),
                    'elementRealPath' => vcapp()->path('devElements/column/column/'),
                    'assetsPath' => $urlHelper->to('devElements/column/column/public/'),
                    'settings' => [
                        'name' => 'Column',
                        'metaThumbnailUrl' => '',
                        'metaPreviewUrl' => '',
                        'metaDescription' => '',
                    ],
                ],
                'textBlock' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/textBlock/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/textBlock/textBlock/'),
                    'elementRealPath' => vcapp()->path('devElements/textBlock/textBlock/'),
                    'assetsPath' => $urlHelper->to('devElements/textBlock/textBlock/public'),
                    'settings' => [
                        'name' => 'Text Block',
                        'metaThumbnailUrl' => $urlHelper->to(
                            'devElements/textBlock/textBlock/public/thumbnail-text-block.png'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                            'devElements/textBlock/textBlock/public/preview-text-block.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Simple text editor for working with static text, including paragraphs, titles, bullets and even media. Simple text block is a copy of default WordPress editor.',
                    ],
                ],
                'basicButton' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/basicButton/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/basicButton/basicButton/'),
                    'elementRealPath' => vcapp()->path('devElements/basicButton/basicButton/'),
                    'assetsPath' => $urlHelper->to('devElements/basicButton/basicButton/public/'),
                    'settings' => [
                        'name' => 'Basic Button',
                        'metaThumbnailUrl' => $urlHelper->to(
                            'devElements/basicButton/basicButton/public/thumbnail-basic-button.png'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                            'devElements/basicButton/basicButton/public/preview-basic-button.png'
                        ),
                        'metaDescription' => 'Basic flat style button with hover effect to catch visitor\'s attention.',
                    ],
                ],
                'basicButtonIcon' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/basicButtonIcon/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/basicButtonIcon/basicButtonIcon/'),
                    'elementRealPath' => vcapp()->path('devElements/basicButtonIcon/basicButtonIcon/'),
                    'assetsPath' => $urlHelper->to('devElements/basicButtonIcon/basicButtonIcon/public/'),
                    'settings' => [
                        'name' => 'Basic Button Icon',
                        'metaThumbnailUrl' => $urlHelper->to(
                            'devElements/basicButtonIcon/basicButtonIcon/public/thumbnail-basic-button-icon.jpg'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                            'devElements/basicButtonIcon/basicButtonIcon/public/preview-basic-button-icon.jpg'
                        ),
                        'metaDescription' => 'Flat style button with icon and slide effect to catch visitor\'s attention.',
                    ],
                ],
                'outlineButton' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/outlineButton/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/outlineButton/outlineButton/'),
                    'elementRealPath' => vcapp()->path('devElements/outlineButton/outlineButton/'),
                    'assetsPath' => $urlHelper->to('devElements/outlineButton/outlineButton/public/'),
                    'settings' => [
                        'name' => 'Outline Button',
                        'metaThumbnailUrl' => $urlHelper->to(
                            'devElements/outlineButton/outlineButton/public/outline-button-thumbnail.png'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                            'devElements/outlineButton/outlineButton/public/outline-button-preview.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Simple outline button with solid fill on hover. Great solution to be used as a secondary button within a website.',
                    ],
                ],
                'outlineButtonIcon' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/outlineButtonIcon/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/outlineButtonIcon/outlineButtonIcon/'),
                    'elementRealPath' => vcapp()->path('devElements/outlineButtonIcon/outlineButtonIcon/'),
                    'assetsPath' => $urlHelper->to('devElements/outlineButtonIcon/outlineButtonIcon/public/'),
                    'settings' => [
                        'name' => 'Outline Button Icon',
                        'metaThumbnailUrl' => $urlHelper->to(
                            'devElements/outlineButtonIcon/outlineButtonIcon/public/outline-button-icon-thumbnail.jpg'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                            'devElements/outlineButtonIcon/outlineButtonIcon/public/outline-button-icon-preview.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Outline button with solid fill and icon appearance o hover. Great solution to be used as a secondary button within a website.',
                    ],
                ],
                'messageBox' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/messageBox/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/messageBox/messageBox/'),
                    'elementRealPath' => vcapp()->path('devElements/messageBox/messageBox/'),
                    'assetsPath' => $urlHelper->to('devElements/messageBox/messageBox/public/'),
                    'settings' => [
                        'name' => 'Message Box',
                        'metaThumbnailUrl' => $urlHelper->to(
                            'devElements/messageBox/messageBox/public/message-box-thumbnail.png'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                            'devElements/messageBox/messageBox/public/message-box-preview.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Add simple message box with predefined notification or create custom message with custom icon.',
                    ],
                ],
                'tabsWithSlide' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/tabsWithSlide/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/tabsWithSlide/tabsWithSlide/'),
                    'elementRealPath' => vcapp()->path('devElements/tabsWithSlide/tabsWithSlide/'),
                    'assetsPath' => $urlHelper->to('devElements/tabsWithSlide/tabsWithSlide/public/'),
                    'settings' => [
                        'name' => 'Tabs With Slide',
                        'metaThumbnailUrl' => $urlHelper->to(
                            'devElements/tabsWithSlide/tabsWithSlide/public/tabs-with-slide-thumbnail.png'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                            'devElements/tabsWithSlide/tabsWithSlide/public/tabs-with-slide-preview.png'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Divide your content into blocks via tab element with slide navigation effect.',
                    ],
                ],
                'tab' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/tab/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/tab/tab/'),
                    'elementRealPath' => vcapp()->path('devElements/tab/tab/'),
                    'assetsPath' => $urlHelper->to('devElements/tab/tab/public/'),
                    'settings' => [
                        'name' => 'Tab',
                        'metaThumbnailUrl' => '',
                        'metaPreviewUrl' => '',
                        'metaDescription' => '',
                    ],
                ],
                'flipBox' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/flipBox/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/flipBox/flipBox/'),
                    'elementRealPath' => vcapp()->path('devElements/flipBox/flipBox/'),
                    'assetsPath' => $urlHelper->to('devElements/flipBox/flipBox/public/'),
                    'settings' => [
                        'name' => 'Flip Box',
                        'metaThumbnailUrl' => $urlHelper->to(
                            'devElements/flipBox/flipBox/public/flip-box-thumbnail.jpg'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                            'devElements/flipBox/flipBox/public/flip-box-preview.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Flip box element with image slide and textual content slide allowing to define default state and flip box background color.',
                    ],
                ],
                'youtubePlayer' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/youtubePlayer/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/youtubePlayer/youtubePlayer/'),
                    'elementRealPath' => vcapp()->path('devElements/youtubePlayer/youtubePlayer/'),
                    'assetsPath' => $urlHelper->to('devElements/youtubePlayer/youtubePlayer/public/'),
                    'settings' => [
                        'name' => 'Youtube Player',
                        'metaThumbnailUrl' => $urlHelper->to(
                            'devElements/youtubePlayer/youtubePlayer/public/youtube-player-thumbnail.png'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                            'devElements/youtubePlayer/youtubePlayer/public/youtube-player-preview.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'YouTube player allows you to display video from YouTube on your website by simply copy/paste link to the video.',
                    ],
                ],
                'vimeoPlayer' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/vimeoPlayer/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/vimeoPlayer/vimeoPlayer/'),
                    'elementRealPath' => vcapp()->path('devElements/vimeoPlayer/vimeoPlayer/'),
                    'assetsPath' => $urlHelper->to('devElements/vimeoPlayer/vimeoPlayer/public/'),
                    'settings' => [
                        'name' => 'Vimeo Player',
                        'metaThumbnailUrl' => $urlHelper->to(
                            'devElements/vimeoPlayer/vimeoPlayer/public/vimeo-player-thumbnail.png'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                            'devElements/vimeoPlayer/vimeoPlayer/public/vimeo-player-preview.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Vimeo player allows you to display video from Vimeo on your website by simply copy/paste link to the video.',
                    ],
                ],
                'singleImage' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/singleImage/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/singleImage/singleImage/'),
                    'elementRealPath' => vcapp()->path('devElements/singleImage/singleImage/'),
                    'assetsPath' => $urlHelper->to('devElements/singleImage/singleImage/public/'),
                    'settings' => [
                        'name' => 'Single Image',
                        'metaThumbnailUrl' => $urlHelper->to(
                            'devElements/singleImage/singleImage/public/thumbnail-single-image.png'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                            'devElements/singleImage/singleImage/public/preview-single-image.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Single image is a basic element for adding images from Media Library into the content area. Single image element includes controls for image manipulations.',
                    ],
                ],
                'heroSection' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/heroSection/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/heroSection/heroSection/'),
                    'elementRealPath' => vcapp()->path('devElements/heroSection/heroSection/'),
                    'assetsPath' => $urlHelper->to('devElements/heroSection/heroSection/public/'),
                    'settings' => [
                        'name' => 'Hero Section',
                        'metaThumbnailUrl' => $urlHelper->to(
                            'devElements/heroSection/heroSection/public/thumbnail-hero-section.jpg'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                            'devElements/heroSection/heroSection/public/preview-hero-section.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Hero section with image background and \'Call to Action\' message with a switchable button and position controls.',
                    ],
                ],
                'icon' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/icon/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/icon/icon/'),
                    'elementRealPath' => vcapp()->path('devElements/icon/icon/'),
                    'assetsPath' => $urlHelper->to('devElements/icon/icon/public/'),
                    'settings' => [
                        'name' => 'Icon',
                        'metaThumbnailUrl' => $urlHelper->to(
                            'devElements/icon/icon/public/thumbnail-icon.jpg'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                            'devElements/icon/icon/public/preview-icon.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Simple icon element with various icons from library and background shape control options.',
                    ],
                ],
                'googleFontsHeading' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/googleFontsHeading/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/googleFontsHeading/googleFontsHeading/'),
                    'elementRealPath' => vcapp()->path('devElements/googleFontsHeading/googleFontsHeading/'),
                    'assetsPath' => $urlHelper->to(
                        'devElements/googleFontsHeading/googleFontsHeading/public/'
                    ),
                    'settings' => [
                        'name' => 'Google Fonts Heading',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/googleFontsHeading/googleFontsHeading/public/google-fonts-thumbnail.png'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/googleFontsHeading/googleFontsHeading/public/google-fonts-preview.png'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Selected Google Fonts with additional styling allows adding eye-catching titles and call to action messages.',
                    ],
                ],
                'wpWidgetsCustom' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/wpWidgetsCustom/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/wpWidgetsCustom/wpWidgetsCustom/'),
                    'elementRealPath' => vcapp()->path('devElements/wpWidgetsCustom/wpWidgetsCustom/'),
                    'assetsPath' => $urlHelper->to(
                        'devElements/wpWidgetsCustom/wpWidgetsCustom/public/'
                    ),
                    'settings' => [
                        'name' => 'Wordpress Custom Widget',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/wpWidgetsCustom/wpWidgetsCustom/public/custom-widgets-thumbnail.png'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/wpWidgetsCustom/wpWidgetsCustom/public/custom-widgets-preview.png'
                        ),
                        'metaDescription' => 'Choose, configure and add custom widgets to your site.',
                    ],
                ],
                'wpWidgetsDefault' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/wpWidgetsDefault/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/wpWidgetsDefault/wpWidgetsDefault/'),
                    'elementRealPath' => vcapp()->path('devElements/wpWidgetsDefault/wpWidgetsDefault/'),
                    'assetsPath' => $urlHelper->to(
                        'devElements/wpWidgetsDefault/wpWidgetsDefault/public/'
                    ),
                    'settings' => [
                        'name' => 'Wordpress Default Widget',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/wpWidgetsDefault/wpWidgetsDefault/public/wordpress-widgets-thumbnail.png'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/wpWidgetsDefault/wpWidgetsDefault/public/wordpress-widgets-preview.png'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Choose, configure and add any of WordPress default widgets to your site.',
                    ],
                ],
                'shortcode' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/shortcode/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/shortcode/shortcode/'),
                    'elementRealPath' => vcapp()->path('devElements/shortcode/shortcode/'),
                    'assetsPath' => $urlHelper->to('devElements/shortcode/shortcode/public/'),
                    'settings' => [
                        'name' => 'Shortcode',
                        'metaThumbnailUrl' => $urlHelper->to(
                            'devElements/shortcode/shortcode/public/shortcode-thumbnail.png'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                            'devElements/shortcode/shortcode/public/shortcode-preview.png'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Add any shortcode available on your WordPress site to the layout.',
                    ],
                ],
                'rawHtml' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/rawHtml/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/rawHtml/rawHtml/'),
                    'elementRealPath' => vcapp()->path('devElements/rawHtml/rawHtml/'),
                    'assetsPath' => $urlHelper->to('devElements/rawHtml/rawHtml/public/'),
                    'settings' => [
                        'name' => 'Raw HTML',
                        'metaThumbnailUrl' => $urlHelper->to(
                            'devElements/rawHtml/rawHtml/public/raw-html-thumbnail.jpg'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                            'devElements/rawHtml/rawHtml/public/raw-html-preview.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Add your own custom HTML code to WordPress website via raw code block that accepts HTML.',
                    ],
                ],
                // 'doubleOutlineButton' => [
                //     'bundlePath' => $urlHelper->to(
                //         'devElements/doubleOutlineButton/public/dist/element.bundle.js'
                //     ),
                //     'elementPath' => $urlHelper->to(
                //         'devElements/doubleOutlineButton/doubleOutlineButton/'
                //     ),
                //     'assetsPath' => $urlHelper->to(
                //         'devElements/doubleOutlineButton/doubleOutlineButton/public/'
                //     ),
                //     'settings' => [
                //         'name' => 'Double Outline Button',
                //         'metaThumbnailUrl' => $urlHelper->to(
                //         // @codingStandardsIgnoreLine
                //             'devElements/doubleOutlineButton/doubleOutlineButton/public/double-outline-button-thumbnail.jpg'
                //         ),
                //         'metaPreviewUrl' => $urlHelper->to(
                //         // @codingStandardsIgnoreLine
                //             'devElements/doubleOutlineButton/doubleOutlineButton/public/double-outline-button-preview.jpg'
                //         ),
                //         // @codingStandardsIgnoreLine
                //         'metaDescription' => 'Double outline button with solid color hover. Great solution for light and dark websites to keep website design consistent.',
                //     ],
                // ],
                'simpleImageSlider' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/simpleImageSlider/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/simpleImageSlider/simpleImageSlider/'),
                    'elementRealPath' => vcapp()->path('devElements/simpleImageSlider/simpleImageSlider/'),
                    'assetsPath' => $urlHelper->to('devElements/simpleImageSlider/simpleImageSlider/public/'),
                    'settings' => [
                        'name' => 'Simple Image Slider',
                        'metaThumbnailUrl' => $urlHelper->to(
                            'devElements/simpleImageSlider/simpleImageSlider/public/thumbnail-simple-image-slider.jpg'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                            'devElements/simpleImageSlider/simpleImageSlider/public/preview-simple-image-slider.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Media Library Image slider with dot controls and swipe option for better mobile experience.',
                    ],
                ],
                'facebookLike' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/facebookLike/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/facebookLike/facebookLike/'),
                    'elementRealPath' => vcapp()->path('devElements/facebookLike/facebookLike/'),
                    'assetsPath' => $urlHelper->to(
                        'devElements/facebookLike/facebookLike/public/'
                    ),
                    'settings' => [
                        'name' => 'Facebook Like',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/facebookLike/facebookLike/public/facebook-like-thumbnail.jpg'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/facebookLike/facebookLike/public/facebook-like-preview.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Add Facebook Like button to your WordPress website for quick content sharing on Facebook.',
                    ],
                ],
                'feature' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/feature/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/feature/feature/'),
                    'elementRealPath' => vcapp()->path('devElements/feature/feature/'),
                    'assetsPath' => $urlHelper->to(
                        'devElements/feature/feature/public/'
                    ),
                    'settings' => [
                        'name' => 'Feature',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/feature/feature/public/thumbnail-feature.jpg'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/feature/feature/public/preview-feature.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Feature element with an icon, title and description. Icon element contains controls for various background shapes.',
                    ],
                ],
                'featureSection' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/featureSection/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/featureSection/featureSection/'),
                    'elementRealPath' => vcapp()->path('devElements/featureSection/featureSection/'),
                    'assetsPath' => $urlHelper->to(
                        'devElements/featureSection/featureSection/public/'
                    ),
                    'settings' => [
                        'name' => 'Feature Section',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/featureSection/featureSection/public/thumbnail-feature-section.jpg'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/featureSection/featureSection/public/preview-feature-section.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Feature section divided into image and content columns. Great for representing product features or company services.',
                    ],
                ],
                'featureDescription' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/featureDescription/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/featureDescription/featureDescription/'),
                    'elementRealPath' => vcapp()->path('devElements/featureDescription/featureDescription/'),
                    'assetsPath' => $urlHelper->to(
                        'devElements/featureDescription/featureDescription/public/'
                    ),
                    'settings' => [
                        'name' => 'Feature Description',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/featureDescription/featureDescription/public/thumbnail-feature-description.png'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/featureDescription/featureDescription/public/preview-feature-description.png'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Feature element with image and call to action button for further information.',
                    ],
                ],
                'flickrImage' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/flickrImage/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/flickrImage/flickrImage/'),
                    'elementRealPath' => vcapp()->path('devElements/flickrImage/flickrImage/'),
                    'assetsPath' => $urlHelper->to(
                        'devElements/flickrImage/flickrImage/public/'
                    ),
                    'settings' => [
                        'name' => 'Flickr Image',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/flickrImage/flickrImage/public/thumbnail-flickr-image.jpg'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/flickrImage/flickrImage/public/preview-flickr-image.jpg'
                        ),
                        'metaDescription' => 'Embed Flickr image directly to your WordPress website.',
                    ],
                ],
                'googleMaps' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/googleMaps/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/googleMaps/googleMaps/'),
                    'elementRealPath' => vcapp()->path('devElements/googleMaps/googleMaps/'),
                    'assetsPath' => $urlHelper->to(
                        'devElements/googleMaps/googleMaps/public/'
                    ),
                    'settings' => [
                        'name' => 'Google Maps',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/googleMaps/googleMaps/public/google-maps-thumbnail.jpg'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/googleMaps/googleMaps/public/google-maps-preview.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Add basic Google Maps via embed code to your WordPress website to display location.',
                    ],
                ],
                'googlePlusButton' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/googlePlusButton/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/googlePlusButton/googlePlusButton/'),
                    'elementRealPath' => vcapp()->path('devElements/googlePlusButton/googlePlusButton/'),
                    'assetsPath' => $urlHelper->to(
                        'devElements/googlePlusButton/googlePlusButton/public/'
                    ),
                    'settings' => [
                        'name' => 'Google Plus Button',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/googlePlusButton/googlePlusButton/public/google-plus-thumbnail.jpg'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/googlePlusButton/googlePlusButton/public/google-plus-preview.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Add standard Google Plus button to your WordPress website for quick content sharing on Google Social Network.',
                    ],
                ],
                // 'gradientButton' => [
                //     'bundlePath' => $urlHelper->to(
                //         'devElements/gradientButton/public/dist/element.bundle.js'
                //     ),
                //     'elementPath' => $urlHelper->to(
                //         'devElements/gradientButton/gradientButton/'
                //     ),
                //     'assetsPath' => $urlHelper->to(
                //         'devElements/gradientButton/gradientButton/public/'
                //     ),
                //     'settings' => [
                //         'name' => 'Gradient Button',
                //         'metaThumbnailUrl' => $urlHelper->to(
                //         // @codingStandardsIgnoreLine
                //             'devElements/gradientButton/gradientButton/public/gradient-button-thumbnail.jpg'
                //         ),
                //         'metaPreviewUrl' => $urlHelper->to(
                //         // @codingStandardsIgnoreLine
                //             'devElements/gradientButton/gradientButton/public/gradient-button-preview.jpg'
                //         ),
                //         // @codingStandardsIgnoreLine
                //         'metaDescription' => 'Gradient button with gradient direction and color controls. Animated hover effects with gradient direction change.',
                //     ],
                // ],
                'imageGallery' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/imageGallery/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/imageGallery/imageGallery/'),
                    'elementRealPath' => vcapp()->path('devElements/imageGallery/imageGallery/'),
                    'assetsPath' => $urlHelper->to(
                        'devElements/imageGallery/imageGallery/public/'
                    ),
                    'settings' => [
                        'name' => 'Image Gallery',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/imageGallery/imageGallery/public/image-gallery-thumbnail.png'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/imageGallery/imageGallery/public/image-gallery-preview.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Image gallery is a basic element for adding simple image gallery from Media Library into the content area.',
                    ],
                ],
                'imageMasonryGallery' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/imageMasonryGallery/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/imageMasonryGallery/imageMasonryGallery/'),
                    'elementRealPath' => vcapp()->path('devElements/imageMasonryGallery/imageMasonryGallery/'),
                    'assetsPath' => $urlHelper->to(
                        'devElements/imageMasonryGallery/imageMasonryGallery/public/'
                    ),
                    'settings' => [
                        'name' => 'Image Masonry Gallery',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/imageMasonryGallery/imageMasonryGallery/public/image-masonry-gallery-thumbnail.png'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/imageMasonryGallery/imageMasonryGallery/public/image-masonry-gallery-preview.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Image masonry gallery is a gallery element for adding simple masonry image gallery from Media Library into the content area.',
                    ],
                ],
                'instagramImage' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/instagramImage/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/instagramImage/instagramImage/'),
                    'elementRealPath' => vcapp()->path('devElements/instagramImage/instagramImage/'),
                    'assetsPath' => $urlHelper->to(
                        'devElements/instagramImage/instagramImage/public/'
                    ),
                    'settings' => [
                        'name' => 'Instagram Image',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/instagramImage/instagramImage/public/thumbnail-instagram.jpg'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/instagramImage/instagramImage/public/preview-instagram.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Embed Instagram image directly to your WordPress website.',
                    ],
                ],
                'pinterestPinit' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/pinterestPinit/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/pinterestPinit/pinterestPinit/'),
                    'elementRealPath' => vcapp()->path('devElements/pinterestPinit/pinterestPinit/'),
                    'assetsPath' => $urlHelper->to(
                        'devElements/pinterestPinit/pinterestPinit/public/'
                    ),
                    'settings' => [
                        'name' => 'Pinterest Pinit',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/pinterestPinit/pinterestPinit/public/pinterest-thumbnail.jpg'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/pinterestPinit/pinterestPinit/public/pinterest-preview.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Add Pinterest Pinit button to your WordPress website for quick media content sharing on Pinterest.',
                    ],
                ],
                'postsGrid' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/postsGrid/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/postsGrid/postsGrid/'),
                    'elementRealPath' => vcapp()->path('devElements/postsGrid/postsGrid/'),
                    'assetsPath' => $urlHelper->to(
                        'devElements/postsGrid/postsGrid/public/'
                    ),
                    'settings' => [
                        'name' => 'Posts Grid',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/postsGrid/postsGrid/public/thumbnail.jpg'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/postsGrid/postsGrid/public/preview.jpg'
                        ),
                        'metaDescription' => 'Long description',
                    ],
                ],
                'postsGridDataSourceCustomPostType' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/postsGridDataSourceCustomPostType/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to(
                        'devElements/postsGridDataSourceCustomPostType/postsGridDataSourceCustomPostType/'
                    ),
                    'elementRealPath' => vcapp()->path(
                        'devElements/postsGridDataSourceCustomPostType/postsGridDataSourceCustomPostType/'
                    ),
                    'assetsPath' => $urlHelper->to(
                        'devElements/postsGridDataSourceCustomPostType/postsGridDataSourceCustomPostType/public/'
                    ),
                    'settings' => [
                        'name' => 'Custom Post Type',
                        'metaDescription' => '',
                    ],
                ],
                'postsGridDataSourcePage' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/postsGridDataSourcePage/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/postsGridDataSourcePage/postsGridDataSourcePage/'),
                    'elementRealPath' => vcapp()->path('devElements/postsGridDataSourcePage/postsGridDataSourcePage/'),
                    'assetsPath' => $urlHelper->to(
                        'devElements/postsGridDataSourcePage/postsGridDataSourcePage/public/'
                    ),
                    'settings' => [
                        'name' => 'Pages',
                        'metaDescription' => '',
                    ],
                ],
                'postsGridDataSourcePost' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/postsGridDataSourcePost/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/postsGridDataSourcePost/postsGridDataSourcePost/'),
                    'elementRealPath' => vcapp()->path('devElements/postsGridDataSourcePost/postsGridDataSourcePost/'),
                    'assetsPath' => $urlHelper->to(
                        'devElements/postsGridDataSourcePost/postsGridDataSourcePost/public/'
                    ),
                    'settings' => [
                        'name' => 'Posts',
                        'metaDescription' => '',
                    ],
                ],
                'postsGridDataSourceListOfIds' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/postsGridDataSourceListOfIds/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to(
                        'devElements/postsGridDataSourceListOfIds/postsGridDataSourceListOfIds/'
                    ),
                    'elementRealPath' => vcapp()->path(
                        'devElements/postsGridDataSourceListOfIds/postsGridDataSourceListOfIds/'
                    ),
                    'assetsPath' => $urlHelper->to(
                        'devElements/postsGridDataSourceListOfIds/postsGridDataSourceListOfIds/public/'
                    ),
                    'settings' => [
                        'name' => 'List Of Ids',
                        'metaDescription' => '',
                    ],
                ],
                'postsGridItemPostDescription' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/postsGridItemPostDescription/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to(
                        'devElements/postsGridItemPostDescription/postsGridItemPostDescription/'
                    ),
                    'elementRealPath' => vcapp()->path(
                        'devElements/postsGridItemPostDescription/postsGridItemPostDescription/'
                    ),
                    'assetsPath' => $urlHelper->to(
                        'devElements/postsGridItemPostDescription/postsGridItemPostDescription/public/'
                    ),
                    'settings' => [
                        'name' => 'Post Description',
                        'metaDescription' => '',
                    ],
                ],
                'rawJs' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/rawJs/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/rawJs/rawJs/'),
                    'elementRealPath' => vcapp()->path('devElements/rawJs/rawJs/'),
                    'assetsPath' => $urlHelper->to(
                        'devElements/rawJs/rawJs/public/'
                    ),
                    'settings' => [
                        'name' => 'Raw JS',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/rawJs/rawJs/public/raw-js-thumbnail.jpg'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/rawJs/rawJs/public/raw-js-preview.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Add your own custom Javascript code to WordPress website to execute it on this particular page.',
                    ],
                ],
                'separator' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/separator/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/separator/separator/'),
                    'elementRealPath' => vcapp()->path('devElements/separator/separator/'),
                    'assetsPath' => $urlHelper->to(
                        'devElements/separator/separator/public/'
                    ),
                    'settings' => [
                        'name' => 'Separator',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/separator/separator/public/separator-thumbnail.png'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/separator/separator/public/separator-preview.png'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Add single line, double, dashed, dotted or shadow style separator as decoration or for separating content blocks.',
                    ],
                ],
                'twitterButton' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/twitterButton/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/twitterButton/twitterButton/'),
                    'elementRealPath' => vcapp()->path('devElements/twitterButton/twitterButton/'),
                    'assetsPath' => $urlHelper->to(
                        'devElements/twitterButton/twitterButton/public/'
                    ),
                    'settings' => [
                        'name' => 'Twitter Button',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/twitterButton/twitterButton/public/tweet-button-thumbnail.jpg'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/twitterButton/twitterButton/public/tweet-button-preview.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Add standard Tweet button to your WordPress website for quick content sharing on Twitter.',
                    ],
                ],
                'twitterGrid' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/twitterGrid/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/twitterGrid/twitterGrid/'),
                    'elementRealPath' => vcapp()->path('devElements/twitterGrid/twitterGrid/'),
                    'assetsPath' => $urlHelper->to(
                        'devElements/twitterGrid/twitterGrid/public/'
                    ),
                    'settings' => [
                        'name' => 'Twitter Grid',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/twitterGrid/twitterGrid/public/twitter-grid-thumbnail.png'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/twitterGrid/twitterGrid/public/twitter-grid-preview.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Showcase Twitter stories that are primarily told with photos, videos, GIFs, and Vines.',
                    ],
                ],
                'twitterTimeline' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/twitterTimeline/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/twitterTimeline/twitterTimeline/'),
                    'elementRealPath' => vcapp()->path('devElements/twitterTimeline/twitterTimeline/'),
                    'assetsPath' => $urlHelper->to(
                        'devElements/twitterTimeline/twitterTimeline/public/'
                    ),
                    'settings' => [
                        'name' => 'Twitter Timeline',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/twitterTimeline/twitterTimeline/public/twitter-timeline-thumbnail.png'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/twitterTimeline/twitterTimeline/public/twitter-timeline-preview.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Embedded timeline to display a stream of Tweets on your site. Use it to showcase profiles, lists, and favorites, as well as the stories.',
                    ],
                ],
                'twitterTweet' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/twitterTweet/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/twitterTweet/twitterTweet/'),
                    'elementRealPath' => vcapp()->path('devElements/twitterTweet/twitterTweet/'),
                    'assetsPath' => $urlHelper->to(
                        'devElements/twitterTweet/twitterTweet/public/'
                    ),
                    'settings' => [
                        'name' => 'Twitter Tweet',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/twitterTweet/twitterTweet/public/twitter-tweet-thumbnail.png'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/twitterTweet/twitterTweet/public/twitter-tweet-preview.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Embedded Tweet to display an individual Tweet off of Twitter by picking tweet URL.',
                    ],
                ],
                'faqToggle' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/faqToggle/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/faqToggle/faqToggle/'),
                    'elementRealPath' => vcapp()->path('devElements/faqToggle/faqToggle/'),
                    'assetsPath' => $urlHelper->to(
                        'devElements/faqToggle/faqToggle/public/'
                    ),
                    'settings' => [
                        'name' => 'Faq Toggle',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/faqToggle/faqToggle/public/faq-thumbnail.png'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/faqToggle/faqToggle/public/faq-preview.png'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Toggle element for frequently added questions (Faq) or similar structure for display of content per request.',
                    ],
                ],
                'doubleSeparator' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/doubleSeparator/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/doubleSeparator/doubleSeparator/'),
                    'elementRealPath' => vcapp()->path('devElements/doubleSeparator/doubleSeparator/'),
                    'assetsPath' => $urlHelper->to(
                        'devElements/doubleSeparator/doubleSeparator/public/'
                    ),
                    'settings' => [
                        'name' => 'Double Separator',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/doubleSeparator/doubleSeparator/public/double-separator-thumbnail.jpg'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/doubleSeparator/doubleSeparator/public/double-separator-preview.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Double line separator with different line length - calculated automatically.',
                    ],
                ],
                'separatorIcon' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/separatorIcon/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/separatorIcon/separatorIcon/'),
                    'elementRealPath' => vcapp()->path('devElements/separatorIcon/separatorIcon/'),
                    'assetsPath' => $urlHelper->to(
                        'devElements/separatorIcon/separatorIcon/public/'
                    ),
                    'settings' => [
                        'name' => 'Separator with Icon',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/separatorIcon/separatorIcon/public/separator-with-icon-thumbnail.png'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/separatorIcon/separatorIcon/public/separator-with-icon-preview.png'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Add separator with an icon as decoration or visual eye-catching marker before content blocks.',
                    ],
                ],
                'separatorTitle' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/separatorTitle/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/separatorTitle/separatorTitle/'),
                    'elementRealPath' => vcapp()->path('devElements/separatorTitle/separatorTitle/'),
                    'assetsPath' => $urlHelper->to(
                        'devElements/separatorTitle/separatorTitle/public/'
                    ),
                    'settings' => [
                        'name' => 'Separator with Title',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/separatorTitle/separatorTitle/public/separator-with-text-thumbnail.png'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/separatorTitle/separatorTitle/public/separator-with-text-preview.png'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Add separator with title as decoration or visual eye-catching marker before content blocks.',
                    ],
                ],
                'pricingTable' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/pricingTable/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/pricingTable/pricingTable/'),
                    'elementRealPath' => vcapp()->path('devElements/pricingTable/pricingTable/'),
                    'assetsPath' => $urlHelper->to('devElements/pricingTable/pricingTable/public/'),
                    'settings' => [
                        'name' => 'Pricing Table',
                        'metaThumbnailUrl' => $urlHelper->to(
                            'devElements/pricingTable/pricingTable/public/thumbnail-pricing-table.jpg'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                            'devElements/pricingTable/pricingTable/public/preview-pricing-table.png'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Simple filled or outline pricing table to display prices of your products or services.',
                    ],
                ],
                'woocommerceTopRatedProducts' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/woocommerceTopRatedProducts/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to(
                        'devElements/woocommerceTopRatedProducts/woocommerceTopRatedProducts/'
                    ),
                    'elementRealPath' => vcapp()->path(
                        'devElements/woocommerceTopRatedProducts/woocommerceTopRatedProducts/'
                    ),
                    'assetsPath' => $urlHelper->to(
                        'devElements/woocommerceTopRatedProducts/woocommerceTopRatedProducts/public/'
                    ),
                    'settings' => [
                        'name' => 'WooCommerce Top Rated Products',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/woocommerceTopRatedProducts/woocommerceTopRatedProducts/public/thumbnail.jpg'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/woocommerceTopRatedProducts/woocommerceTopRatedProducts/public/preview.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'WooCommerce Element',
                    ],
                ],
                'woocommerceSaleProducts' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/woocommerceSaleProducts/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/woocommerceSaleProducts/woocommerceSaleProducts/'),
                    'elementRealPath' => vcapp()->path('devElements/woocommerceSaleProducts/woocommerceSaleProducts/'),
                    'assetsPath' => $urlHelper->to(
                        'devElements/woocommerceSaleProducts/woocommerceSaleProducts/public/'
                    ),
                    'settings' => [
                        'name' => 'WooCommerce Sale Products',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/woocommerceSaleProducts/woocommerceSaleProducts/public/thumbnail.jpg'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/woocommerceSaleProducts/woocommerceSaleProducts/public/preview.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'WooCommerce Element',
                    ],
                ],
                'woocommerceRelatedProducts' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/woocommerceRelatedProducts/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to(
                        'devElements/woocommerceRelatedProducts/woocommerceRelatedProducts/'
                    ),
                    'elementRealPath' => vcapp()->path(
                        'devElements/woocommerceRelatedProducts/woocommerceRelatedProducts/'
                    ),
                    'assetsPath' => $urlHelper->to(
                        'devElements/woocommerceRelatedProducts/woocommerceRelatedProducts/public/'
                    ),
                    'settings' => [
                        'name' => 'WooCommerce Related Products',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/woocommerceRelatedProducts/woocommerceRelatedProducts/public/thumbnail.jpg'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/woocommerceRelatedProducts/woocommerceRelatedProducts/public/preview.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'WooCommerce Element',
                    ],
                ],
                'woocommerceRecentProducts' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/woocommerceRecentProducts/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/woocommerceRecentProducts/woocommerceRecentProducts/'),
                    'elementRealPath' => vcapp()->path(
                        'devElements/woocommerceRecentProducts/woocommerceRecentProducts/'
                    ),
                    'assetsPath' => $urlHelper->to(
                        'devElements/woocommerceRecentProducts/woocommerceRecentProducts/public/'
                    ),
                    'settings' => [
                        'name' => 'WooCommerce Recent Products',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/woocommerceRecentProducts/woocommerceRecentProducts/public/thumbnail.jpg'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/woocommerceRecentProducts/woocommerceRecentProducts/public/preview.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'WooCommerce Element',
                    ],
                ],
                'woocommerceProducts' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/woocommerceProducts/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/woocommerceProducts/woocommerceProducts/'),
                    'elementRealPath' => vcapp()->path('devElements/woocommerceProducts/woocommerceProducts/'),
                    'assetsPath' => $urlHelper->to(
                        'devElements/woocommerceProducts/woocommerceProducts/public/'
                    ),
                    'settings' => [
                        'name' => 'WooCommerce Products',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/woocommerceProducts/woocommerceProducts/public/thumbnail.jpg'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/woocommerceProducts/woocommerceProducts/public/preview.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'WooCommerce Element',
                    ],
                ],
                'woocommerceProductPage' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/woocommerceProductPage/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/woocommerceProductPage/woocommerceProductPage/'),
                    'elementRealPath' => vcapp()->path('devElements/woocommerceProductPage/woocommerceProductPage/'),
                    'assetsPath' => $urlHelper->to(
                        'devElements/woocommerceProductPage/woocommerceProductPage/public/'
                    ),
                    'settings' => [
                        'name' => 'WooCommerce Product Page',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/woocommerceProductPage/woocommerceProductPage/public/thumbnail.jpg'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/woocommerceProductPage/woocommerceProductPage/public/preview.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'WooCommerce Element',
                    ],
                ],
                'woocommerceProductCategory' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/woocommerceProductCategory/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to(
                        'devElements/woocommerceProductCategory/woocommerceProductCategory/'
                    ),
                    'elementRealPath' => vcapp()->path(
                        'devElements/woocommerceProductCategory/woocommerceProductCategory/'
                    ),
                    'assetsPath' => $urlHelper->to(
                        'devElements/woocommerceProductCategory/woocommerceProductCategory/public/'
                    ),
                    'settings' => [
                        'name' => 'WooCommerce Product Category',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/woocommerceProductCategory/woocommerceProductCategory/public/thumbnail.jpg'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/woocommerceProductCategory/woocommerceProductCategory/public/preview.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'WooCommerce Element',
                    ],
                ],
                'woocommerceProductCategories' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/woocommerceProductCategories/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to(
                        'devElements/woocommerceProductCategories/woocommerceProductCategories/'
                    ),
                    'elementRealPath' => vcapp()->path(
                        'devElements/woocommerceProductCategories/woocommerceProductCategories/'
                    ),
                    'assetsPath' => $urlHelper->to(
                        'devElements/woocommerceProductCategories/woocommerceProductCategories/public/'
                    ),
                    'settings' => [
                        'name' => 'WooCommerce Product Categories',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/woocommerceProductCategories/woocommerceProductCategories/public/thumbnail.jpg'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/woocommerceProductCategories/woocommerceProductCategories/public/preview.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'WooCommerce Element',
                    ],
                ],
                'woocommerceProductAttribute' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/woocommerceProductAttribute/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to(
                        'devElements/woocommerceProductAttribute/woocommerceProductAttribute/'
                    ),
                    'elementRealPath' => vcapp()->path(
                        'devElements/woocommerceProductAttribute/woocommerceProductAttribute/'
                    ),
                    'assetsPath' => $urlHelper->to(
                        'devElements/woocommerceProductAttribute/woocommerceProductAttribute/public/'
                    ),
                    'settings' => [
                        'name' => 'WooCommerce Product Attribute',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/woocommerceProductAttribute/woocommerceProductAttribute/public/thumbnail.jpg'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/woocommerceProductAttribute/woocommerceProductAttribute/public/preview.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'WooCommerce Element',
                    ],
                ],
                'woocommerceProduct' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/woocommerceProduct/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/woocommerceProduct/woocommerceProduct/'),
                    'elementRealPath' => vcapp()->path('devElements/woocommerceProduct/woocommerceProduct/'),
                    'assetsPath' => $urlHelper->to(
                        'devElements/woocommerceProduct/woocommerceProduct/public/'
                    ),
                    'settings' => [
                        'name' => 'WooCommerce Product',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/woocommerceProduct/woocommerceProduct/public/thumbnail.jpg'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/woocommerceProduct/woocommerceProduct/public/preview.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'WooCommerce Element',
                    ],
                ],
                'woocommerceOrderTracking' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/woocommerceOrderTracking/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/woocommerceOrderTracking/woocommerceOrderTracking/'),
                    'elementRealPath' => vcapp()->path(
                        'devElements/woocommerceOrderTracking/woocommerceOrderTracking/'
                    ),
                    'assetsPath' => $urlHelper->to(
                        'devElements/woocommerceOrderTracking/woocommerceOrderTracking/public/'
                    ),
                    'settings' => [
                        'name' => 'WooCommerce Order Tracking',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/woocommerceOrderTracking/woocommerceOrderTracking/public/thumbnail.jpg'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/woocommerceOrderTracking/woocommerceOrderTracking/public/preview.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'WooCommerce Element',
                    ],
                ],
                'woocommerceMyAccount' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/woocommerceMyAccount/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/woocommerceMyAccount/woocommerceMyAccount/'),
                    'elementRealPath' => vcapp()->path('devElements/woocommerceMyAccount/woocommerceMyAccount/'),
                    'assetsPath' => $urlHelper->to(
                        'devElements/woocommerceMyAccount/woocommerceMyAccount/public/'
                    ),
                    'settings' => [
                        'name' => 'WooCommerce My Account',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/woocommerceMyAccount/woocommerceMyAccount/public/thumbnail.jpg'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/woocommerceMyAccount/woocommerceMyAccount/public/preview.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'WooCommerce Element',
                    ],
                ],
                'woocommerceFeaturedProducts' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/woocommerceFeaturedProducts/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to(
                        'devElements/woocommerceFeaturedProducts/woocommerceFeaturedProducts/'
                    ),
                    'elementRealPath' => vcapp()->path(
                        'devElements/woocommerceFeaturedProducts/woocommerceFeaturedProducts/'
                    ),
                    'assetsPath' => $urlHelper->to(
                        'devElements/woocommerceFeaturedProducts/woocommerceFeaturedProducts/public/'
                    ),
                    'settings' => [
                        'name' => 'WooCommerce Featured Products',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/woocommerceFeaturedProducts/woocommerceFeaturedProducts/public/thumbnail.jpg'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/woocommerceFeaturedProducts/woocommerceFeaturedProducts/public/preview.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'WooCommerce Element',
                    ],
                ],
                'woocommerceCheckout' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/woocommerceCheckout/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/woocommerceCheckout/woocommerceCheckout/'),
                    'elementRealPath' => vcapp()->path('devElements/woocommerceCheckout/woocommerceCheckout/'),
                    'assetsPath' => $urlHelper->to(
                        'devElements/woocommerceCheckout/woocommerceCheckout/public/'
                    ),
                    'settings' => [
                        'name' => 'WooCommerce Checkout',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/woocommerceCheckout/woocommerceCheckout/public/thumbnail.jpg'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/woocommerceCheckout/woocommerceCheckout/public/preview.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'WooCommerce Element',
                    ],
                ],
                'woocommerceCart' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/woocommerceCart/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/woocommerceCart/woocommerceCart/'),
                    'elementRealPath' => vcapp()->path('devElements/woocommerceCart/woocommerceCart/'),
                    'assetsPath' => $urlHelper->to(
                        'devElements/woocommerceCart/woocommerceCart/public/'
                    ),
                    'settings' => [
                        'name' => 'WooCommerce Cart',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/woocommerceCart/woocommerceCart/public/thumbnail.jpg'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/woocommerceCart/woocommerceCart/public/preview.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'WooCommerce Element',
                    ],
                ],
                'woocommerceBestSellingProducts' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/woocommerceBestSellingProducts/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to(
                        'devElements/woocommerceBestSellingProducts/woocommerceBestSellingProducts/'
                    ),
                    'elementRealPath' => vcapp()->path(
                        'devElements/woocommerceBestSellingProducts/woocommerceBestSellingProducts/'
                    ),
                    'assetsPath' => $urlHelper->to(
                        'devElements/woocommerceBestSellingProducts/woocommerceBestSellingProducts/public/'
                    ),
                    'settings' => [
                        'name' => 'WooCommerce Best Selling Products',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/woocommerceBestSellingProducts/woocommerceBestSellingProducts/public/thumbnail.jpg'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/woocommerceBestSellingProducts/woocommerceBestSellingProducts/public/preview.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'WooCommerce Element',
                    ],
                ],
                'woocommerceAddToCart' => [
                    'bundlePath' => $urlHelper->to(
                        'devElements/woocommerceAddToCart/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('devElements/woocommerceAddToCart/woocommerceAddToCart/'),
                    'elementRealPath' => vcapp()->path('devElements/woocommerceAddToCart/woocommerceAddToCart/'),
                    'assetsPath' => $urlHelper->to(
                        'devElements/woocommerceAddToCart/woocommerceAddToCart/public/'
                    ),
                    'settings' => [
                        'name' => 'WooCommerce Add To Cart',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/woocommerceAddToCart/woocommerceAddToCart/public/thumbnail.jpg'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'devElements/woocommerceAddToCart/woocommerceAddToCart/public/preview.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'WooCommerce Element',
                    ],
                ],
                //                'transparentOutlineButton' => [
                //                    'bundlePath' => $urlHelper->to(
                //                        'devElements/transparentOutlineButton/public/dist/element.bundle.js'
                //                    ),
                //                    'elementPath' => $urlHelper->to('devElements/transparentOutlineButton/transparentOutlineButton/'),
                //                    'elementRealPath' => vcapp()->path('devElements/transparentOutlineButton/transparentOutlineButton/'),
                //                    'assetsPath' => $urlHelper->to('devElements/transparentOutlineButton/transparentOutlineButton/public/'),
                //                    'settings' => [
                //                        'name' => 'Transparent Outline Button',
                //                        'metaThumbnailUrl' => $urlHelper->to(
                //                            'devElements/transparentOutlineButton/transparentOutlineButton/public/thumbnail-transparent-outline-button.png'
                //                        ),
                //                        'metaPreviewUrl' => $urlHelper->to(
                //                            'devElements/transparentOutlineButton/transparentOutlineButton/public/preview-transparent-outline-button.png'
                //                        ),
                //                        'metaDescription' => 'Transparent outline button with fill color effect on hover is perfect for dark or colorful backgrounds.',
                //                    ],
                //                ],
                //                                'parallelogramButton' => [
                //                                    'bundlePath' => $urlHelper->to(
                //                                        'devElements/parallelogramButton/public/dist/element.bundle.js'
                //                                    ),
                //                                    'elementPath' => $urlHelper->to('devElements/parallelogramButton/parallelogramButton/'),
                //                                    'elementRealPath' => vcapp()->path('devElements/parallelogramButton/parallelogramButton/'),
                //                                    'assetsPath' => $urlHelper->to('devElements/parallelogramButton/parallelogramButton/public/'),
                //                                    'settings' => [
                //                                        'name' => 'Parallelogram Button',
                //                                        'metaThumbnailUrl' => $urlHelper->to(
                //                                            'devElements/parallelogramButton/parallelogramButton/public/thumbnail-parallelogram-button.png'
                //                                        ),
                //                                        'metaPreviewUrl' => $urlHelper->to(
                //                                            'devElements/parallelogramButton/parallelogramButton/public/preview-parallelogram-button.png'
                //                                        ),
                //                                        'metaDescription' => 'A button in parallelogram shape with ability to control angle.',
                //                                    ],
                //                                ],
                //                                'resizeButton' => [
                //                                    'bundlePath' => $urlHelper->to(
                //                                        'devElements/resizeButton/public/dist/element.bundle.js'
                //                                    ),
                //                                    'elementPath' => $urlHelper->to('devElements/resizeButton/resizeButton/'),
                //                                    'elementRealPath' => vcapp()->path('devElements/resizeButton/resizeButton/'),
                //                                    'assetsPath' => $urlHelper->to('devElements/resizeButton/resizeButton/public/'),
                //                                    'settings' => [
                //                                        'name' => 'Resize Button',
                //                                        'metaThumbnailUrl' => $urlHelper->to(
                //                                            'devElements/resizeButton/resizeButton/public/thumbnail-resize-button.png'
                //                                        ),
                //                                        'metaPreviewUrl' => $urlHelper->to(
                //                                            'devElements/resizeButton/resizeButton/public/preview-resize-button.png'
                //                                        ),
                //                                        'metaDescription' => 'A simple button that resizes with animation on hover to catch user attention.',
                //                                    ],
                //                                ],
                //                'outlineShadowButton' => [
                //                    'bundlePath' => $urlHelper->to(
                //                        'devElements/outlineShadowButton/public/dist/element.bundle.js'
                //                    ),
                //                    'elementPath' => $urlHelper->to('devElements/outlineShadowButton/outlineShadowButton/'),
                //                    'elementRealPath' => vcapp()->path('devElements/outlineShadowButton/outlineShadowButton/'),
                //                    'assetsPath' => $urlHelper->to('devElements/outlineShadowButton/outlineShadowButton/public/'),
                //                    'settings' => [
                //                        'name' => 'Outline Shadow Button',
                //                        'metaThumbnailUrl' => $urlHelper->to(
                //                            'devElements/outlineShadowButton/outlineShadowButton/public/thumbnail-outline-shadow-button.png'
                //                        ),
                //                        'metaPreviewUrl' => $urlHelper->to(
                //                            'devElements/outlineShadowButton/outlineShadowButton/public/preview-outline-shadow-button.png'
                //                        ),
                //                        'metaDescription' => 'A geometric style outline button with custom hover color option.',
                //                    ],
                //                ],
                //                'underlineButton' => [
                //                    'bundlePath' => $urlHelper->to(
                //                        'devElements/underlineButton/public/dist/element.bundle.js'
                //                    ),
                //                    'elementPath' => $urlHelper->to('devElements/underlineButton/underlineButton/'),
                //                    'elementRealPath' => vcapp()->path('devElements/underlineButton/underlineButton/'),
                //                    'assetsPath' => $urlHelper->to('devElements/underlineButton/underlineButton/public/'),
                //                    'settings' => [
                //                        'name' => 'Underline Button',
                //                        'metaThumbnailUrl' => $urlHelper->to(
                //                            'devElements/underlineButton/underlineButton/public/thumbnail-underline-button.png'
                //                        ),
                //                        'metaPreviewUrl' => $urlHelper->to(
                //                            'devElements/underlineButton/underlineButton/public/preview-underline-button.png'
                //                        ),
                //                        'metaDescription' => 'A simple text button with underline and resize animation.',
                //                    ],
                //                ],
                //                'borderHoverButton' => [
                //                    'bundlePath' => $urlHelper->to(
                //                        'devElements/borderHoverButton/public/dist/element.bundle.js'
                //                    ),
                //                    'elementPath' => $urlHelper->to('devElements/borderHoverButton/borderHoverButton/'),
                //                    'elementRealPath' => vcapp()->path('devElements/borderHoverButton/borderHoverButton/'),
                //                    'assetsPath' => $urlHelper->to('devElements/borderHoverButton/borderHoverButton/public/'),
                //                    'settings' => [
                //                        'name' => 'Border Hover Button',
                //                        'metaThumbnailUrl' => $urlHelper->to(
                //                            'devElements/borderHoverButton/borderHoverButton/public/thumbnail-border-hover-button.png'
                //                        ),
                //                        'metaPreviewUrl' => $urlHelper->to(
                //                            'devElements/borderHoverButton/borderHoverButton/public/preview-border-hover-button.png'
                //                        ),
                //                        'metaDescription' => 'Button with border accent as a hover effect and ability to control border color.',
                //                    ],
                //                ],
                //                '3dButton' => [
                //                    'bundlePath' => $urlHelper->to(
                //                        'devElements/3dButton/public/dist/element.bundle.js'
                //                    ),
                //                    'elementPath' => $urlHelper->to('devElements/3dButton/3dButton/'),
                //                    'elementRealPath' => vcapp()->path('devElements/3dButton/3dButton/'),
                //                    'assetsPath' => $urlHelper->to('devElements/3dButton/3dButton/public/'),
                //                    'settings' => [
                //                        'name' => '3D Button',
                //                        'metaThumbnailUrl' => $urlHelper->to(
                //                            'devElements/3dButton/3dButton/public/thumbnail-3d-button.png'
                //                        ),
                //                        'metaPreviewUrl' => $urlHelper->to(
                //                            'devElements/3dButton/3dButton/public/preview-3d-button.png'
                //                        ),
                //                        'metaDescription' => 'A 3D style button with the ability to control a hover and animation states.',
                //                    ],
                //                ],
                //                'strikeThroughOutlineButton' => [
                //                    'bundlePath' => $urlHelper->to(
                //                        'devElements/strikeThroughOutlineButton/public/dist/element.bundle.js'
                //                    ),
                //                    'elementPath' => $urlHelper->to('devElements/strikeThroughOutlineButton/strikeThroughOutlineButton/'),
                //                    'elementRealPath' => vcapp()->path('devElements/strikeThroughOutlineButton/strikeThroughOutlineButton/'),
                //                    'assetsPath' => $urlHelper->to('devElements/strikeThroughOutlineButton/strikeThroughOutlineButton/public/'),
                //                    'settings' => [
                //                        'name' => 'Strike Through Outline Button',
                //                        'metaThumbnailUrl' => $urlHelper->to(
                //                            'devElements/strikeThroughOutlineButton/strikeThroughOutlineButton/public/thumbnail-strike-through-outline-button.png'
                //                        ),
                //                        'metaPreviewUrl' => $urlHelper->to(
                //                            'devElements/strikeThroughOutlineButton/strikeThroughOutlineButton/public/preview-strike-through-outline-button.png'
                //                        ),
                //                        'metaDescription' => 'Outline button with a horizontal or vertical strike through and fill color effect on hover.',
                //                    ],
                //                ],
                //                'simpleGradientButton' => [
                //                    'bundlePath' => $urlHelper->to(
                //                        'devElements/simpleGradientButton/public/dist/element.bundle.js'
                //                    ),
                //                    'elementPath' => $urlHelper->to('devElements/simpleGradientButton/simpleGradientButton/'),
                //                    'elementRealPath' => vcapp()->path('devElements/simpleGradientButton/simpleGradientButton/'),
                //                    'assetsPath' => $urlHelper->to('devElements/simpleGradientButton/simpleGradientButton/public/'),
                //                    'settings' => [
                //                        'name' => 'Simple Gradient Button',
                //                        'metaThumbnailUrl' => $urlHelper->to(
                //                            'devElements/simpleGradientButton/simpleGradientButton/public/thumbnail-simple-gradient-button.png'
                //                        ),
                //                        'metaPreviewUrl' => $urlHelper->to(
                //                            'devElements/simpleGradientButton/simpleGradientButton/public/preview-simple-gradient-button.png'
                //                        ),
                //                        'metaDescription' => 'A simple gradient button with automatic gradient effect calculation.',
                //                    ],
                //                ],
                //                'quoteButton' => [
                //                    'bundlePath' => $urlHelper->to(
                //                        'devElements/quoteButton/public/dist/element.bundle.js'
                //                    ),
                //                    'elementPath' => $urlHelper->to('devElements/quoteButton/quoteButton/'),
                //                    'elementRealPath' => vcapp()->path('devElements/quoteButton/quoteButton/'),
                //                    'assetsPath' => $urlHelper->to('devElements/quoteButton/quoteButton/public/'),
                //                    'settings' => [
                //                        'name' => 'Quote Button',
                //                        'metaThumbnailUrl' => $urlHelper->to(
                //                            'devElements/quoteButton/quoteButton/public/thumbnail-quote-button.png'
                //                        ),
                //                        'metaPreviewUrl' => $urlHelper->to(
                //                            'devElements/quoteButton/quoteButton/public/preview-quote-button.png'
                //                        ),
                //                        'metaDescription' => 'Quote button is a good call to action that points directly to the content.',
                //                    ],
                //                ]
            ]
        );
        // 'animatedOutlineButton' => [
        //   'bundlePath' => $urlHelper->to(
        //       'devElements/animatedOutlineButton/public/dist/element.bundle.js'
        //   ),
        //   'elementPath' => $urlHelper->to('devElements/animatedOutlineButton/animatedOutlineButton/'),
        //'elementRealPath' => vcapp()->path('devElements/animatedOutlineButton/animatedOutlineButton/'),
        // @codingStandardsIgnoreLine
        //   'assetsPath' => $urlHelper->to('devElements/animatedOutlineButton/animatedOutlineButton/public/'),
        //   'settings' => [
        //       'name' => 'Animated Outline Button',
        //       'metaThumbnailUrl' => $urlHelper->to(
        //           'devElements/animatedOutlineButton/animatedOutlineButton/public/animated-outline-button-thumbnail.jpg'
        //       ),
        //       'metaPreviewUrl' => $urlHelper->to(
        //           'devElements/animatedOutlineButton/animatedOutlineButton/public/animated-outline-button-preview.jpg'
        //       ),
        //       'metaDescription' => 'Underline-to-outline button with smooth transition effect for hover state.',
        //   ],
        // ],
    }
}
