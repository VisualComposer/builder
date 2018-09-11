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
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Url;

/**
 * Class Categories
 * @package VisualComposer\Modules\Hub
 */
class HubCategories extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    /**
     * Categories constructor.
     */
    public function __construct()
    {
        if (vcvenv('VCV_ENV_DEV_CATEGORIES')) {
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
                'Row' => [
                    'title' => 'Row/Column',
                    'elements' => ['row', 'grid'],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Row.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Row.svg'),
                ],
                'Column' => [
                    'title' => 'Column',
                    'elements' => ['column', 'gridItem'],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Column.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Column.svg'),
                ],
                'Tabs' => [
                    'title' => 'Tabs',
                    'elements' => ['tabsWithSlide', 'classicTabs', 'pageableContainer'],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Container.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Container.svg'),
                ],
                'Tab' => [
                    'title' => 'Tab',
                    'elements' => ['tab', 'classicTab', 'pageableTab'],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Container.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Container.svg'),
                ],
                'Button' => [
                    'title' => 'Simple Button',
                    'elements' => [
                        'basicButton',
                        'basicButtonIcon',
                        'outlineButton',
                        'outlineButtonIcon',
                        'gradientButton',
                        'animatedOutlineButton',
                        'doubleOutlineButton',
                        'transparentOutlineButton',
                        'parallelogramButton',
                        'resizeButton',
                        'outlineShadowButton',
                        'underlineButton',
                        'borderHoverButton',
                        '3dButton',
                        'strikethroughOutlineButton',
                        'simpleGradientButton',
                        'quoteButton',
                        'strikethroughButton',
                        'filledShadowButton',
                        'animatedShadowButton',
                        'symmetricButton',
                        'zigZagButton',
                        'smoothShadowButton',
                        'halfOutlineButton',
                        'gatsbyButton',
                        'animatedIconButton',
                        'animatedTwoColorButton',
                        'separatedButton',
                        'zigZagSeparator',
                        'buttonGroup',
                        'basicShadowButton',
                    ],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Button.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Button.svg'),
                ],
                'Header & Footer' => [
                    'title' => 'Header & Footer',
                    'elements' => [
                        'sandwichMenu',
                        'logoWidget',
                        'copyright',
                        'basicMenu',
                        'sidebarMenu',
                        'verticalSandwichMenu',
                    ],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Header-Footer.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Header-Footer.svg'),
                ],
                'Feature' => [
                    'title' => 'Feature',
                    'elements' => ['feature'],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Feature.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Feature.svg'),
                ],
                'Feature section' => [
                    'title' => 'Feature Section',
                    'elements' => ['featureSection'],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Feature.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Feature.svg'),
                ],
                'Section' => [
                    'title' => 'Section',
                    'elements' => ['section'],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Section.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Section.svg'),
                ],
                'Hero section' => [
                    'title' => 'Hero Section',
                    'elements' => ['heroSection'],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Hero-Section.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Hero-Section.svg'),
                ],
                'Icon' => [
                    'title' => 'Icon',
                    'elements' => ['icon', 'iconGroup'],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Icon.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Icon.svg'),
                ],
                'Image Slider' => [
                    'title' => 'Image Slider',
                    'elements' => ['simpleImageSlider', 'logoSlider'],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Image-Slider.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Image-Slider.svg'),
                ],
                'Single image' => [
                    'title' => 'Single Image',
                    'elements' => ['singleImage'],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Single-Image.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Single-Image.svg'),
                ],
                'Image gallery' => [
                    'title' => 'Image Gallery',
                    'elements' => [
                        'imageMasonryGallery',
                        'imageGallery',
                        'multipleImageCollage',
                        'imageGalleryWithScaleUp',
                        'imageGalleryWithIcon',
                        'imageGalleryWithZoom',
                        'imageMasonryGalleryWithZoom',
                        'imageMasonryGalleryWithIcon',
                        'imageMasonryGalleryWithScaleUp',
                    ],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Image-Gallery.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Image-Gallery.svg'),
                ],
                'Text block' => [
                    'title' => 'Text Block',
                    'elements' => ['textBlock', 'googleFontsHeading', 'typewriterHeading', 'marqueeElement'],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Text-Block.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Text-Block.svg'),
                ],
                'Misc' => [
                    'title' => 'Misc',
                    'elements' => ['rawHtml', 'rawJs', 'demoElement', 'syntaxHighlighter', 'globalTemplate', 'timelineWithIcons'],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Misc.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Misc.svg'),
                ],
                'Pricing table' => [
                    'title' => 'Pricing Table',
                    'elements' => ['pricingTable', 'outlinePricingTable'],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Pricing-Table.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Pricing-Table.svg'),
                ],
                'Social' => [
                    'title' => 'Social',
                    'elements' => [
                        'twitterGrid',
                        'twitterTweet',
                        'twitterTimeline',
                        'twitterButton',
                        'flickrImage',
                        'flickrWidget',
                        'instagramImage',
                        'googlePlusButton',
                        'pinterestPinit',
                        'facebookLike',
                        'facebookShare',
                        'facebookSave',
                        'facebookComments',
                        'facebookQuote',
                        'facebookPage',
                        'facebookEmbeddedVideo',
                        'facebookEmbeddedComments',
                        'facebookEmbeddedPosts',
                    ],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Social.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Social.svg'),
                ],
                'Videos' => [
                    'title' => 'Videos',
                    'elements' => ['youtubePlayer', 'vimeoPlayer', 'videoPlayer', 'videoPopup'],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Video.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Video.svg'),
                ],
                'WooCommerce' => [
                    'title' => 'WooCommerce',
                    'elements' => [
                        'woocommerceTopRatedProducts',
                        'woocommerceSaleProducts',
                        'woocommerceRelatedProducts',
                        'woocommerceRecentProducts',
                        'woocommerceProducts',
                        'woocommerceProductPage',
                        'woocommerceProductCategory',
                        'woocommerceProductCategories',
                        'woocommerceProductAttribute',
                        'woocommerceProduct',
                        'woocommerceOrderTracking',
                        'woocommerceMyAccount',
                        'woocommerceFeaturedProducts',
                        'woocommerceCheckout',
                        'woocommerceCart',
                        'woocommerceBestSellingProducts',
                        'woocommerceAddToCart',
                        'woocommerceProducts32',
                    ],
                    'icon' => $urlHelper->to('devCategories/categories/icons/WordPress.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/WordPress.svg'),
                ],
                'Separators' => [
                    'title' => 'Separators',
                    'elements' => ['separator', 'doubleSeparator', 'separatorIcon', 'separatorTitle'],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Separator.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Separator.svg'),
                ],
                'Maps' => [
                    'title' => 'Maps',
                    'elements' => ['googleMaps'],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Map.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Map.svg'),
                ],
                'Grids' => [
                    'title' => 'Grids',
                    'elements' => [
                        'postsGrid',
                        'featuredImagePostGrid',
                        'centeredPostGrid',
                        'postsSlider',
                        'slideOutPostGrid',
                    ],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Post-Grid.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Post-Grid.svg'),
                ],
                '_postsGridSources' => [
                    'title' => 'Post Grid Data Sources',
                    'elements' => [
                        'postsGridDataSourcePost',
                        'postsGridDataSourcePage',
                        'postsGridDataSourceCustomPostType',
                        'postsGridDataSourceListOfIds',
                    ],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Post-Grid.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Post-Grid.svg'),
                ],
                '_postsGridItems' => [
                    'title' => 'Post Grid Item Post Description',
                    'elements' => [
                        'postsGridItemPostDescription',
                        'featuredImagePostGridItem',
                        'centeredPostGridItem',
                        'postsSliderItem',
                        'slideOutPostGridItem',
                    ],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Post-Grid.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Post-Grid.svg'),
                ],
                'Toggle' => [
                    'title' => 'Toggle',
                    'elements' => ['faqToggle', 'outlineFaqToggle'],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Toggle.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Toggle.svg'),
                ],
                'Message Box' => [
                    'title' => 'Message Box',
                    'elements' => ['messageBox', 'outlineMessageBox', 'simpleMessageBox', 'semiFilledMessageBox'],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Message-Box.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Message-Box.svg'),
                ],
                'Hover Box' => [
                    'title' => 'Hover Box',
                    'elements' => ['flipBox', 'hoverBox', 'iconHoverBox', 'tallHoverBox'],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Hover-Box.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Hover-Box.svg'),
                ],
                'WordPress' => [
                    'title' => 'WordPress',
                    'elements' => [
                        'shortcode',
                        'wpWidgetsCustom',
                        'wpWidgetsDefault',
                        'widgetizedSidebar',
                        'contactForm7',
                        'ninjaForms',
                        'gravityForms',
                        'sliderRevolution',
                        'layerSlider',
                        'essentialGrid',
                        'addToAnyShareButtons',
                        'nextGenGallery',
                        'wpForms',
                        'eventOnCalendar',
                        'enviraGallery',
                        'advancedCustomFields',
                        'mailChimpForWordPress',
                        'gutenberg',
                        'calderaForms',
                        'wpDataTables',
                        'captainForm',
                    ],
                    'icon' => $urlHelper->to('devCategories/categories/icons/WordPress.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/WordPress.svg'),
                ],
                'Feature Description' => [
                    'title' => 'Feature Description',
                    'elements' => ['featureDescription'],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Feature.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Feature.svg'),
                ],
                'Call To Action' => [
                    'title' => 'Call To Action',
                    'elements' => ['callToAction', 'simpleCallToAction', 'outlineCallToAction'],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Call-To-Action.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Call-To-Action.svg'),
                ],
                'Empty Space' => [
                    'title' => 'Empty Space',
                    'elements' => ['emptySpace'],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Misc.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Misc.svg'),
                ],
                'Testimonial' => [
                    'title' => 'Testimonial',
                    'elements' => ['testimonial'],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Testimonial.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Testimonial.svg'),
                ],
                'Accordions' => [
                    'title' => 'Accordions',
                    'elements' => ['classicAccordion'],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Container.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Container.svg'),
                ],
                'Accordion Section' => [
                    'title' => 'Accordion Section',
                    'elements' => ['classicAccordionSection'],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Container.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Container.svg'),
                ],
                'Charts' => [
                    'title' => 'Charts',
                    'elements' => ['progressBars'],
                    'icon' => $urlHelper->to('devCategories/categories/icons/Chart.svg'),
                    'iconDark' => $urlHelper->to('devCategories/categories/iconsDark/Chart.svg'),
                ],
            ]
        );
    }
}
