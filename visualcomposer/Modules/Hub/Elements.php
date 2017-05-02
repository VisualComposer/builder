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
                'shortcode' => [
                    'bundlePath' => $urlHelper->to(
                        'public/sources/newElements/shortcode/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('public/sources/newElements/shortcode/shortcode/'),
                    'assetsPath' => $urlHelper->to('public/sources/newElements/shortcode/shortcode/public/'),
                    'settings' => [
                        'name' => 'Shortcode',
                        'metaThumbnailUrl' => $urlHelper->to(
                            'public/sources/newElements/shortcode/shortcode/public/shortcode-thumbnail.png'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                            'public/sources/newElements/shortcode/shortcode/public/shortcode-preview.png'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Add any shortcode available on your WordPress site to the layout.',
                    ],
                ],
                'rawHtml' => [
                    'bundlePath' => $urlHelper->to(
                        'public/sources/newElements/rawHtml/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to('public/sources/newElements/rawHtml/rawHtml/'),
                    'assetsPath' => $urlHelper->to('public/sources/newElements/rawHtml/rawHtml/public/'),
                    'settings' => [
                        'name' => 'Raw HTML',
                        'metaThumbnailUrl' => $urlHelper->to(
                            'public/sources/newElements/rawHtml/rawHtml/public/raw-html-thumbnail.jpg'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                            'public/sources/newElements/rawHtml/rawHtml/public/raw-html-preview.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Add your own custom HTML code to WordPress website via raw code block that accepts HTML.',
                    ],
                ],
                // 'doubleOutlineButton' => [
                //     'bundlePath' => $urlHelper->to(
                //         'public/sources/newElements/doubleOutlineButton/public/dist/element.bundle.js'
                //     ),
                //     'elementPath' => $urlHelper->to(
                //         'public/sources/newElements/doubleOutlineButton/doubleOutlineButton/'
                //     ),
                //     'assetsPath' => $urlHelper->to(
                //         'public/sources/newElements/doubleOutlineButton/doubleOutlineButton/public/'
                //     ),
                //     'settings' => [
                //         'name' => 'Double Outline Button',
                //         'metaThumbnailUrl' => $urlHelper->to(
                //         // @codingStandardsIgnoreLine
                //             'public/sources/newElements/doubleOutlineButton/doubleOutlineButton/public/double-outline-button-thumbnail.jpg'
                //         ),
                //         'metaPreviewUrl' => $urlHelper->to(
                //         // @codingStandardsIgnoreLine
                //             'public/sources/newElements/doubleOutlineButton/doubleOutlineButton/public/double-outline-button-preview.jpg'
                //         ),
                //         // @codingStandardsIgnoreLine
                //         'metaDescription' => 'Double outline button with solid color hover. Great solution for light and dark websites to keep website design consistent.',
                //     ],
                // ],
                // 'facebookLike' => [
                //     'bundlePath' => $urlHelper->to(
                //         'public/sources/newElements/facebookLike/public/dist/element.bundle.js'
                //     ),
                //     'elementPath' => $urlHelper->to(
                //         'public/sources/newElements/facebookLike/facebookLike/'
                //     ),
                //     'assetsPath' => $urlHelper->to(
                //         'public/sources/newElements/facebookLike/facebookLike/public/'
                //     ),
                //     'settings' => [
                //         'name' => 'Facebook Like',
                //         'metaThumbnailUrl' => $urlHelper->to(
                //         // @codingStandardsIgnoreLine
                //             'public/sources/newElements/facebookLike/facebookLike/public/facebook-like-thumbnail.jpg'
                //         ),
                //         'metaPreviewUrl' => $urlHelper->to(
                //         // @codingStandardsIgnoreLine
                //             'public/sources/newElements/facebookLike/facebookLike/public/facebook-like-preview.jpg'
                //         ),
                //         // @codingStandardsIgnoreLine
                //         'metaDescription' => 'Add Facebook Like button to your WordPress website for quick content sharing on Facebook.',
                //     ],
                // ],
                // 'feature' => [
                //     'bundlePath' => $urlHelper->to(
                //         'public/sources/newElements/feature/public/dist/element.bundle.js'
                //     ),
                //     'elementPath' => $urlHelper->to(
                //         'public/sources/newElements/feature/feature/'
                //     ),
                //     'assetsPath' => $urlHelper->to(
                //         'public/sources/newElements/feature/feature/public/'
                //     ),
                //     'settings' => [
                //         'name' => 'Feature',
                //         'metaThumbnailUrl' => $urlHelper->to(
                //         // @codingStandardsIgnoreLine
                //             'public/sources/newElements/feature/feature/public/thumbnail-feature.jpg'
                //         ),
                //         'metaPreviewUrl' => $urlHelper->to(
                //         // @codingStandardsIgnoreLine
                //             'public/sources/newElements/feature/feature/public/preview-feature.jpg'
                //         ),
                //         'metaDescription' => 'Long description',
                //     ],
                // ],
                // 'featureSection' => [
                //     'bundlePath' => $urlHelper->to(
                //         'public/sources/newElements/featureSection/public/dist/element.bundle.js'
                //     ),
                //     'elementPath' => $urlHelper->to(
                //         'public/sources/newElements/featureSection/featureSection/'
                //     ),
                //     'assetsPath' => $urlHelper->to(
                //         'public/sources/newElements/featureSection/featureSection/public/'
                //     ),
                //     'settings' => [
                //         'name' => 'Feature Section',
                //         'metaThumbnailUrl' => $urlHelper->to(
                //         // @codingStandardsIgnoreLine
                //             'public/sources/newElements/featureSection/featureSection/public/thumbnail-feature-section.jpg'
                //         ),
                //         'metaPreviewUrl' => $urlHelper->to(
                //         // @codingStandardsIgnoreLine
                //             'public/sources/newElements/featureSection/featureSection/public/preview-feature-section.jpg'
                //         ),
                //         // @codingStandardsIgnoreLine
                //         'metaDescription' => 'Feature section divided into image and content columns. Great for representing product features or company services.',
                //     ],
                // ],
                'flickrImage' => [
                    'bundlePath' => $urlHelper->to(
                        'public/sources/newElements/flickrImage/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to(
                        'public/sources/newElements/flickrImage/flickrImage/'
                    ),
                    'assetsPath' => $urlHelper->to(
                        'public/sources/newElements/flickrImage/flickrImage/public/'
                    ),
                    'settings' => [
                        'name' => 'Flickr Image',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'public/sources/newElements/flickrImage/flickrImage/public/thumbnail-flickr-image.jpg'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'public/sources/newElements/flickrImage/flickrImage/public/preview-flickr-image.jpg'
                        ),
                        'metaDescription' => 'Embed Flickr image directly to your WordPress website.',
                    ],
                ],
                'googleMaps' => [
                    'bundlePath' => $urlHelper->to(
                        'public/sources/newElements/googleMaps/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to(
                        'public/sources/newElements/googleMaps/googleMaps/'
                    ),
                    'assetsPath' => $urlHelper->to(
                        'public/sources/newElements/googleMaps/googleMaps/public/'
                    ),
                    'settings' => [
                        'name' => 'Google Maps',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'public/sources/newElements/googleMaps/googleMaps/public/google-maps-thumbnail.jpg'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'public/sources/newElements/googleMaps/googleMaps/public/google-maps-preview.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Add basic Google Maps via embed code to your WordPress website to display location.',
                    ],
                ],
                'googlePlusButton' => [
                    'bundlePath' => $urlHelper->to(
                        'public/sources/newElements/googlePlusButton/public/dist/element.bundle.js'
                    ),
                    'elementPath' => $urlHelper->to(
                        'public/sources/newElements/googlePlusButton/googlePlusButton/'
                    ),
                    'assetsPath' => $urlHelper->to(
                        'public/sources/newElements/googlePlusButton/googlePlusButton/public/'
                    ),
                    'settings' => [
                        'name' => 'Google Plus Button',
                        'metaThumbnailUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'public/sources/newElements/googlePlusButton/googlePlusButton/public/google-plus-thumbnail.jpg'
                        ),
                        'metaPreviewUrl' => $urlHelper->to(
                        // @codingStandardsIgnoreLine
                            'public/sources/newElements/googlePlusButton/googlePlusButton/public/google-plus-preview.jpg'
                        ),
                        // @codingStandardsIgnoreLine
                        'metaDescription' => 'Add standard Google Plus button to your WordPress website for quick content sharing on Google Social Network.',
                    ],
                ],
                // 'gradientButton' => [
                //     'bundlePath' => $urlHelper->to(
                //         'public/sources/newElements/gradientButton/public/dist/element.bundle.js'
                //     ),
                //     'elementPath' => $urlHelper->to(
                //         'public/sources/newElements/gradientButton/gradientButton/'
                //     ),
                //     'assetsPath' => $urlHelper->to(
                //         'public/sources/newElements/gradientButton/gradientButton/public/'
                //     ),
                //     'settings' => [
                //         'name' => 'Gradient Button',
                //         'metaThumbnailUrl' => $urlHelper->to(
                //         // @codingStandardsIgnoreLine
                //             'public/sources/newElements/gradientButton/gradientButton/public/gradient-button-thumbnail.jpg'
                //         ),
                //         'metaPreviewUrl' => $urlHelper->to(
                //         // @codingStandardsIgnoreLine
                //             'public/sources/newElements/gradientButton/gradientButton/public/gradient-button-preview.jpg'
                //         ),
                //         // @codingStandardsIgnoreLine
                //         'metaDescription' => 'Gradient button with gradient direction and color controls. Animated hover effects with gradient direction change.',
                //     ],
                // ],
                 'imageGallery' => [
                     'bundlePath' => $urlHelper->to(
                         'public/sources/newElements/imageGallery/public/dist/element.bundle.js'
                     ),
                     'elementPath' => $urlHelper->to(
                         'public/sources/newElements/imageGallery/imageGallery/'
                     ),
                     'assetsPath' => $urlHelper->to(
                         'public/sources/newElements/imageGallery/imageGallery/public/'
                     ),
                     'settings' => [
                         'name' => 'Image Gallery',
                         'metaThumbnailUrl' => $urlHelper->to(
                         // @codingStandardsIgnoreLine
                             'public/sources/newElements/imageGallery/imageGallery/public/image-gallery-thumbnail.png'
                         ),
                         'metaPreviewUrl' => $urlHelper->to(
                         // @codingStandardsIgnoreLine
                             'public/sources/newElements/imageGallery/imageGallery/public/image-gallery-preview.jpg'
                         ),
                         'metaDescription' => 'Image gallery is a basic element for adding simple image gallery from Media Library into the content area.',
                     ],
                 ],
                 'imageMasonryGallery' => [
                     'bundlePath' => $urlHelper->to(
                         'public/sources/newElements/imageMasonryGallery/public/dist/element.bundle.js'
                     ),
                     'elementPath' => $urlHelper->to(
                         'public/sources/newElements/imageMasonryGallery/imageMasonryGallery/'
                     ),
                     'assetsPath' => $urlHelper->to(
                         'public/sources/newElements/imageMasonryGallery/imageMasonryGallery/public/'
                     ),
                     'settings' => [
                         'name' => 'Image Masonry Gallery',
                         'metaThumbnailUrl' => $urlHelper->to(
                         // @codingStandardsIgnoreLine
                             'public/sources/newElements/imageMasonryGallery/imageMasonryGallery/public/image-masonry-gallery-thumbnail.png'
                         ),
                         'metaPreviewUrl' => $urlHelper->to(
                         // @codingStandardsIgnoreLine
                             'public/sources/newElements/imageMasonryGallery/imageMasonryGallery/public/image-masonry-gallery-preview.jpg'
                         ),
                         // @codingStandardsIgnoreLine
                         'metaDescription' => 'Image masonry gallery is a gallery element for adding simple masonry image gallery from Media Library into the content area.',
                     ],
                 ],
                // 'instagramImage' => [
                //     'bundlePath' => $urlHelper->to(
                //         'public/sources/newElements/instagramImage/public/dist/element.bundle.js'
                //     ),
                //     'elementPath' => $urlHelper->to(
                //         'public/sources/newElements/instagramImage/instagramImage/'
                //     ),
                //     'assetsPath' => $urlHelper->to(
                //         'public/sources/newElements/instagramImage/instagramImage/public/'
                //     ),
                //     'settings' => [
                //         'name' => 'Instagram Image',
                //         'metaThumbnailUrl' => $urlHelper->to(
                //         // @codingStandardsIgnoreLine
                //             'public/sources/newElements/instagramImage/instagramImage/public/thumbnail-instagram.jpg'
                //         ),
                //         'metaPreviewUrl' => $urlHelper->to(
                //         // @codingStandardsIgnoreLine
                //             'public/sources/newElements/instagramImage/instagramImage/public/preview-instagram.jpg'
                //         ),
                //         // @codingStandardsIgnoreLine
                //         'metaDescription' => 'Long description',
                //     ],
                // ],
                // 'pinterestPinit' => [
                //     'bundlePath' => $urlHelper->to(
                //         'public/sources/newElements/pinterestPinit/public/dist/element.bundle.js'
                //     ),
                //     'elementPath' => $urlHelper->to(
                //         'public/sources/newElements/pinterestPinit/pinterestPinit/'
                //     ),
                //     'assetsPath' => $urlHelper->to(
                //         'public/sources/newElements/pinterestPinit/pinterestPinit/public/'
                //     ),
                //     'settings' => [
                //         'name' => 'Pinterest Pinit',
                //         'metaThumbnailUrl' => $urlHelper->to(
                //         // @codingStandardsIgnoreLine
                //             'public/sources/newElements/pinterestPinit/pinterestPinit/public/pinterest-thumbnail.jpg'
                //         ),
                //         'metaPreviewUrl' => $urlHelper->to(
                //         // @codingStandardsIgnoreLine
                //             'public/sources/newElements/pinterestPinit/pinterestPinit/public/pinterest-preview.jpg'
                //         ),
                //         // @codingStandardsIgnoreLine
                //         'metaDescription' => 'Add Pinterest Pinit button to your WordPress website for quick media content sharing on Pinterest.',
                //     ],
                // ],
                // 'postsGrid' => [
                //     'bundlePath' => $urlHelper->to(
                //         'public/sources/newElements/postsGrid/public/dist/element.bundle.js'
                //     ),
                //     'elementPath' => $urlHelper->to(
                //         'public/sources/newElements/postsGrid/postsGrid/'
                //     ),
                //     'assetsPath' => $urlHelper->to(
                //         'public/sources/newElements/postsGrid/postsGrid/public/'
                //     ),
                //     'settings' => [
                //         'name' => 'Posts Grid',
                //         'metaThumbnailUrl' => $urlHelper->to(
                //         // @codingStandardsIgnoreLine
                //             'public/sources/newElements/postsGrid/postsGrid/public/thumbnail.jpg'
                //         ),
                //         'metaPreviewUrl' => $urlHelper->to(
                //         // @codingStandardsIgnoreLine
                //             'public/sources/newElements/postsGrid/postsGrid/public/preview.jpg'
                //         ),
                //         'metaDescription' => 'Long description',
                //     ],
                // ],
                // 'postsGridDataSourceCustomPostType' => [
                //     'bundlePath' => $urlHelper->to(
                //         'public/sources/newElements/postsGridDataSourceCustomPostType/public/dist/element.bundle.js'
                //     ),
                //     'elementPath' => $urlHelper->to(
                //         'public/sources/newElements/postsGridDataSourceCustomPostType/postsGridDataSourceCustomPostType/'
                //     ),
                //     'assetsPath' => $urlHelper->to(
                //         'public/sources/newElements/postsGridDataSourceCustomPostType/postsGridDataSourceCustomPostType/public/'
                //     ),
                //     'settings' => [
                //         'name' => 'Custom Post Type',
                //         'metaDescription' => '',
                //     ],
                // ],
                // 'postsGridDataSourcePage' => [
                //     'bundlePath' => $urlHelper->to(
                //         'public/sources/newElements/postsGridDataSourcePage/public/dist/element.bundle.js'
                //     ),
                //     'elementPath' => $urlHelper->to(
                //         'public/sources/newElements/postsGridDataSourcePage/postsGridDataSourcePage/'
                //     ),
                //     'assetsPath' => $urlHelper->to(
                //         'public/sources/newElements/postsGridDataSourcePage/postsGridDataSourcePage/public/'
                //     ),
                //     'settings' => [
                //         'name' => 'Pages',
                //         'metaDescription' => '',
                //     ],
                // ],
                // 'postsGridDataSourcePost' => [
                //     'bundlePath' => $urlHelper->to(
                //         'public/sources/newElements/postsGridDataSourcePost/public/dist/element.bundle.js'
                //     ),
                //     'elementPath' => $urlHelper->to(
                //         'public/sources/newElements/postsGridDataSourcePost/postsGridDataSourcePost/'
                //     ),
                //     'assetsPath' => $urlHelper->to(
                //         'public/sources/newElements/postsGridDataSourcePost/postsGridDataSourcePost/public/'
                //     ),
                //     'settings' => [
                //         'name' => 'Posts',
                //         'metaDescription' => '',
                //     ],
                // ],
                // 'postsGridItemPostDescription' => [
                //     'bundlePath' => $urlHelper->to(
                //         'public/sources/newElements/postsGridItemPostDescription/public/dist/element.bundle.js'
                //     ),
                //     'elementPath' => $urlHelper->to(
                //         'public/sources/newElements/postsGridItemPostDescription/postsGridItemPostDescription/'
                //     ),
                //     'assetsPath' => $urlHelper->to(
                //         'public/sources/newElements/postsGridItemPostDescription/postsGridItemPostDescription/public/'
                //     ),
                //     'settings' => [
                //         'name' => 'Outline Button',
                //         'metaDescription' => '',
                //     ],
                // ],
                // 'rawJs' => [
                //     'bundlePath' => $urlHelper->to(
                //         'public/sources/newElements/rawJs/public/dist/element.bundle.js'
                //     ),
                //     'elementPath' => $urlHelper->to(
                //         'public/sources/newElements/rawJs/rawJs/'
                //     ),
                //     'assetsPath' => $urlHelper->to(
                //         'public/sources/newElements/rawJs/rawJs/public/'
                //     ),
                //     'settings' => [
                //         'name' => 'Raw JS',
                //         'metaThumbnailUrl' => $urlHelper->to(
                //         // @codingStandardsIgnoreLine
                //             'public/sources/newElements/rawJs/rawJs/public/raw-js-thumbnail.jpg'
                //         ),
                //         'metaPreviewUrl' => $urlHelper->to(
                //         // @codingStandardsIgnoreLine
                //             'public/sources/newElements/rawJs/rawJs/public/raw-js-preview.jpg'
                //         ),
                //         'metaDescription' => 'Long description',
                //     ],
                // ],
                // 'separator' => [
                //     'bundlePath' => $urlHelper->to(
                //         'public/sources/newElements/separator/public/dist/element.bundle.js'
                //     ),
                //     'elementPath' => $urlHelper->to(
                //         'public/sources/newElements/separator/separator/'
                //     ),
                //     'assetsPath' => $urlHelper->to(
                //         'public/sources/newElements/separator/separator/public/'
                //     ),
                //     'settings' => [
                //         'name' => 'Separator',
                //         'metaThumbnailUrl' => $urlHelper->to(
                //         // @codingStandardsIgnoreLine
                //             'public/sources/newElements/separator/separator/public/thumbnail-separator.jpg'
                //         ),
                //         'metaPreviewUrl' => $urlHelper->to(
                //         // @codingStandardsIgnoreLine
                //             'public/sources/newElements/separator/separator/public/preview-separator.jpg'
                //         ),
                //         // @codingStandardsIgnoreLine
                //         'metaDescription' => 'Double line separator with different line length - calculated automatically. ',
                //     ],
                // ],
                // 'twitterButton' => [
                //     'bundlePath' => $urlHelper->to(
                //         'public/sources/newElements/twitterButton/public/dist/element.bundle.js'
                //     ),
                //     'elementPath' => $urlHelper->to(
                //         'public/sources/newElements/twitterButton/twitterButton/'
                //     ),
                //     'assetsPath' => $urlHelper->to(
                //         'public/sources/newElements/twitterButton/twitterButton/public/'
                //     ),
                //     'settings' => [
                //         'name' => 'Twitter Button',
                //         'metaThumbnailUrl' => $urlHelper->to(
                //         // @codingStandardsIgnoreLine
                //             'public/sources/newElements/twitterButton/twitterButton/public/tweet-button-thumbnail.jpg'
                //         ),
                //         'metaPreviewUrl' => $urlHelper->to(
                //         // @codingStandardsIgnoreLine
                //             'public/sources/newElements/twitterButton/twitterButton/public/tweet-button-preview.jpg'
                //         ),
                //         // @codingStandardsIgnoreLine
                //         'metaDescription' => 'Add standard Tweet button to your WordPress website for quick content sharing on Twitter.',
                //     ],
                // ],
                // 'twitterGrid' => [
                //     'bundlePath' => $urlHelper->to(
                //         'public/sources/newElements/twitterGrid/public/dist/element.bundle.js'
                //     ),
                //     'elementPath' => $urlHelper->to(
                //         'public/sources/newElements/twitterGrid/twitterGrid/'
                //     ),
                //     'assetsPath' => $urlHelper->to(
                //         'public/sources/newElements/twitterGrid/twitterGrid/public/'
                //     ),
                //     'settings' => [
                //         'name' => 'Twitter Grid',
                //         'metaThumbnailUrl' => $urlHelper->to(
                //         // @codingStandardsIgnoreLine
                //             'public/sources/newElements/twitterGrid/twitterGrid/public/twitter-grid-thumbnail.png'
                //         ),
                //         'metaPreviewUrl' => $urlHelper->to(
                //         // @codingStandardsIgnoreLine
                //             'public/sources/newElements/twitterGrid/twitterGrid/public/twitter-grid-preview.jpg'
                //         ),
                //         'metaDescription' => 'Long description',
                //     ],
                // ],
                // 'twitterTimeline' => [
                //     'bundlePath' => $urlHelper->to(
                //         'public/sources/newElements/twitterTimeline/public/dist/element.bundle.js'
                //     ),
                //     'elementPath' => $urlHelper->to(
                //         'public/sources/newElements/twitterTimeline/twitterTimeline/'
                //     ),
                //     'assetsPath' => $urlHelper->to(
                //         'public/sources/newElements/twitterTimeline/twitterTimeline/public/'
                //     ),
                //     'settings' => [
                //         'name' => 'Twitter Timeline',
                //         'metaThumbnailUrl' => $urlHelper->to(
                //         // @codingStandardsIgnoreLine
                //             'public/sources/newElements/twitterTimeline/twitterTimeline/public/twitter-timeline-thumbnail.png'
                //         ),
                //         'metaPreviewUrl' => $urlHelper->to(
                //         // @codingStandardsIgnoreLine
                //             'public/sources/newElements/twitterTimeline/twitterTimeline/public/twitter-timeline-preview.jpg'
                //         ),
                //         'metaDescription' => 'Long description',
                //     ],
                // ],
                // 'twitterTweet' => [
                //     'bundlePath' => $urlHelper->to(
                //         'public/sources/newElements/twitterTweet/public/dist/element.bundle.js'
                //     ),
                //     'elementPath' => $urlHelper->to(
                //         'public/sources/newElements/twitterTweet/twitterTweet/'
                //     ),
                //     'assetsPath' => $urlHelper->to(
                //         'public/sources/newElements/twitterTweet/twitterTweet/public/'
                //     ),
                //     'settings' => [
                //         'name' => 'Twitter Tweet',
                //         'metaThumbnailUrl' => $urlHelper->to(
                //         // @codingStandardsIgnoreLine
                //             'public/sources/newElements/twitterTweet/twitterTweet/public/twitter-tweet-thumbnail.png'
                //         ),
                //         'metaPreviewUrl' => $urlHelper->to(
                //         // @codingStandardsIgnoreLine
                //             'public/sources/newElements/twitterTweet/twitterTweet/public/twitter-tweet-preview.jpg'
                //         ),
                //         'metaDescription' => 'Long description',
                //     ],
                // ],
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
