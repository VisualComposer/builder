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
                'elements' => [
                    'row',
                    'grid',
                    'textBlock',
                    'basicButton',
                    'outlineButton',
                    'singleImage',
                    'shortcode',
                    'wpWidgetsCustom',
                    'wpWidgetsDefault',
                    'widgetizedSidebar',
                    'emptySpace',
                    'callToAction',
                    'faqToggle',
                    'separator',
                    'socialProfileIcons',
                    'feature',
                    'featureSection',
                    'rawHtml',
                    'rawJs',
                    'globalTemplate',
                    'simpleContactForm',
                    'heroSection',
                    'basicMenu',
                    'icon',
                    'imageGallery',
                    'imageMasonryGallery',
                    'simpleImageSlider',
                    'messageBox',
                    'youtubePlayer',
                    'vimeoPlayer'
                ],
            ],
            'Media' => [
                'title' => 'Media',
                'elements' => [
                    'singleImage',
                    'bannerElement',
                    'giphy',
                    'hoverImage',
                    'phoneMockup',
                    'browserMockup',
                    'parallaxSingleImage',
                    'gifAnimation',
                    'instagramImage',
                    'flipBox',
                    'iconHoverBox',
                    'tallHoverBox',
                    'imageGallery',
                    'imageMasonryGallery',
                    'multipleImageCollage',
                    'imageMasonryGalleryWithIcon',
                    'imageMasonryGalleryWithScaleUp',
                    'imageMasonryGalleryWithZoom',
                    'imageGalleryWithIcon',
                    'imageGalleryWithScaleUp',
                    'imageGalleryWithZoom',
                    'simpleImageSlider',
                    'timelineSlideshow',
                    'youtubePlayer',
                    'vimeoPlayer',
                    'videoPlayer',
                    'videoPopup',
                ],
            ],
            'Buttons' => [
                'title' => 'Buttons',
                'elements' => [
                    'basicButton',
                    'outlineButton',
                    'basicButtonIcon',
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
                    'basicShadowButton',
                    'growShadowButton',
                    '3ColorButton',
                    'doubleTextButton',
                    'callToActionButton',
                    'iconButton',
                    'buttonGroup'
                ],
            ],
            'E-Commerce' => [
                'title' => 'E-Commerce',
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
                    'cartIconWithCounter',
                    'pricingTable',
                    'outlinePricingTable',
                    'shadowPricingTable',
                ],
            ],
            'Containers' => [
                'title' => 'Containers',
                'elements' => [
                    'row',
                    'section',
                    'classicAccordion',
                    'tabsWithSlide',
                    'classicTabs',
                    'pageableContainer',
                    'contentSlider',
                    'toggleContainer',
                ],
            ],
            'Social' => [
                'title' => 'Social',
                'elements' => [
                    'addToAnyShareButtons',
                    'googleMaps',
                    'instagramImage',
                    'socialProfileIcons',
                    'facebookLike',
                    'facebookShare',
                    'facebookSave',
                    'facebookComments',
                    'facebookQuote',
                    'facebookPage',
                    'facebookEmbeddedVideo',
                    'facebookEmbeddedComments',
                    'facebookEmbeddedPosts',
                    'flickrImage',
                    'flickrWidget',
                    'monoSocialIcons',
                    'pinterestPinit',
                    'twitterGrid',
                    'twitterTweet',
                    'twitterTimeline',
                    'twitterButton',
                ],
            ],
            'Integrations' => [
                'title' => 'Integrations',
                'elements' => [
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
                    'googleMaps',
                    'giphy',
                    'soundcloudPlayer'
                ],
            ],
            'Menus' => [
                'title' => 'Menus',
                'elements' => [
                    'basicMenu',
                    'sandwichMenu',
                    'sandwichSideMenu',
                    'sidebarMenu',
                    'verticalSandwichMenu',
                    'linkDropdown'
                ],
            ],
            'Post Grids' => [
                'title' => 'Post Grids',
                'elements' => [
                    'postsGrid',
                    'featuredImagePostGrid',
                    'centeredPostGrid',
                    'postsSlider',
                    'slideOutPostGrid',
                    'sidePostGrid',
                    'newsPostGrid',
                    'backgroundImagePostGrid',
                    'postGridWithBox',
                    'postSliderBlock',
                    'portfolioPostGrid',
                    'postGridWithHoverButton',
                ],
            ],
            'Other' => [
                'title' => 'Other',
                'elements' => [
                    'typewriterHeading',
                    'marqueeElement',
                    'doubleTitle',
                    'linkDropdown',
                    'logoWidget',
                    'copyright',
                    'testimonial',
                    'basicTestimonial',
                    'starTestimonials',
                    'buttonGroup',
                    'widgetizedSidebar',
                    'simpleSearch',
                    'counterUp',
                    'countdownTimer',
                    'progressBars',
                    'callToAction',
                    'featureDescription',
                    'outlineFaqToggle',
                    'faqGroup',
                    'doubleSeparator',
                    'separatorIcon',
                    'separatorTitle',
                    'zigZagSeparator',
                    'flipBox',
                    'hoverBox',
                    'iconHoverBox',
                    'demoElement',
                    'foodAndDrinksMenu',
                    'syntaxHighlighter',
                    'timelineWithIcons',
                    'profileWithIcon',
                    'starRanking',
                    'iconGroup',
                    'multipleImageCollage',
                    'logoSlider',
                    'outlineMessageBox',
                    'simpleMessageBox',
                    'semiFilledMessageBox'
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
