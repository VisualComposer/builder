<?php

namespace VisualComposer\Helpers\Hub;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;

class Categories implements Helper
{
    protected $thirdPartyCategoriesElements = [];

    public function addCategoryElements($category, $elements)
    {
        if (!isset($this->thirdPartyCategoriesElements[ $category ])) {
            $this->thirdPartyCategoriesElements[ $category ] = ['elements' => []];
        }
        $this->thirdPartyCategoriesElements[ $category ]['elements'] = array_merge(
            $this->thirdPartyCategoriesElements[ $category ]['elements'],
            $elements
        );
    }

    public function getCategories($type = false)
    {
        $categoriesDiffer = vchelper('Differ');
        $optionHelper = vchelper('Options');

        if ($type) {
            $hubCategories = $optionHelper->get('hubCategories', []);
        } else {
            $hubCategories = $this->getHubCategories();
        }

        $hubCategories = vcfilter('vcv:helpers:hub:getCategories', $hubCategories);
        $categoriesDiffer->set($hubCategories);

        $categoriesDiffer->onUpdate(
            function ($key, $oldValue, $newValue, $mergedValue) {
                if (empty($oldValue)) {
                    return []; // Do not allow to create 'new' categories
                }
                $mergedValue['elements'] = array_values(
                    array_unique(array_merge($oldValue['elements'], $newValue['elements']))
                );

                return $mergedValue;
            }
        )->set(
            $this->thirdPartyCategoriesElements
        );
        $new = $categoriesDiffer->get();

        return $new;
    }

    public function setCategories($categories = [])
    {
        $optionHelper = vchelper('Options');

        return $optionHelper->set('hubCategories', $categories);
    }

    public function updateCategory($key, $prev, $new, $merged)
    {
        $categoryUrl = rtrim($this->getCategoriesUrl(), '\\/');
        $dataHelper = vchelper('Data');
        if (isset($merged['icon'])) {
            $merged['icon'] = str_replace(
                '[publicPath]',
                $categoryUrl,
                $merged['icon']
            );
        }
        if (isset($merged['icon'])) {
            $merged['iconDark'] = str_replace(
                '[publicPath]',
                $categoryUrl,
                $merged['iconDark']
            );
        }

        if (!empty($prev)) {
            if (isset($new['elements']) && is_array($new['elements']) && isset($prev['elements'])) {
                $merged['elements'] = array_values(
                    $dataHelper->arrayDeepUnique(array_merge($prev['elements'], $new['elements']))
                );
            }
        }

        return $merged;
    }

    public function getCategoriesPath($key = '')
    {
        return VCV_PLUGIN_ASSETS_DIR_PATH . '/categories/' . ltrim($key, '\\/');
    }

    public function getCategoriesUrl($key = '')
    {
        $assetsHelper = vchelper('Assets');

        return $assetsHelper->getAssetUrl('/categories/' . ltrim($key, '\\/'));
    }

    /**
     * Return all default elements categories.
     * @return array
     */
    public function getHubCategories()
    {
        $optionHelper = vchelper('Options');
        $urlHelper = vchelper('Url');
        $categoriesDiffer = vchelper('Differ');
        $hubCategoriesHelper = vchelper('HubCategories');

        $defaultCategories = [
            'Row' => [
                'title' => 'Row/Column',
                'elements' => ['row', 'grid'],
                'icon' => $urlHelper->to('public/categories/icons/Row.svg'),
                'iconDark' => $urlHelper->to('public/categories/iconsDark/Row.svg'),
            ],
            'Column' => [
                'title' => 'Column',
                'elements' => ['column', 'gridItem'],
                'icon' => $urlHelper->to('public/categories/icons/Column.svg'),
                'iconDark' => $urlHelper->to('public/categories/iconsDark/Column.svg'),
            ],
            'Tabs' => [
                'title' => 'Tabs',
                'elements' => [
                    'tabsWithSlide',
                    'classicTabs',
                    'pageableContainer',
                    'contentSlider',
                    'toggleContainer',
                    'faqGroup',
                ],
                'icon' => $urlHelper->to('public/categories/icons/Container.svg'),
                'iconDark' => $urlHelper->to('public/categories/iconsDark/Container.svg'),
            ],
            'Tab' => [
                'title' => 'Tab',
                'elements' => [
                    'tab',
                    'classicTab',
                    'pageableTab',
                    'contentSlide',
                    'toggleContainerTab',
                ],
                'icon' => $urlHelper->to('public/categories/icons/Container.svg'),
                'iconDark' => $urlHelper->to('public/categories/iconsDark/Container.svg'),
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
                    'basicShadowButton',
                    'growShadowButton',
                    '3ColorButton',
                    'doubleTextButton',
                    'callToActionButton',
                    'iconButton',
                    'buttonGroup',
                ],
                'icon' => $urlHelper->to('public/categories/icons/Button.svg'),
                'iconDark' => $urlHelper->to('public/categories/iconsDark/Button.svg'),
            ],
            'Header & Footer' => [
                'title' => 'Header & Footer',
                'elements' => [
                    'logoWidget',
                    'copyright',
                    'basicMenu',
                    'sandwichMenu',
                    'sandwichSideMenu',
                    'sidebarMenu',
                    'verticalSandwichMenu',
                    'linkDropdown',
                ],
                'icon' => $urlHelper->to('public/categories/icons/Header-Footer.svg'),
                'iconDark' => $urlHelper->to('public/categories/iconsDark/Header-Footer.svg'),
            ],
            'Feature' => [
                'title' => 'Feature',
                'elements' => ['feature'],
                'icon' => $urlHelper->to('public/categories/icons/Feature.svg'),
                'iconDark' => $urlHelper->to('public/categories/iconsDark/Feature.svg'),
            ],
            'Feature section' => [
                'title' => 'Feature Section',
                'elements' => ['featureSection'],
                'icon' => $urlHelper->to('public/categories/icons/Feature.svg'),
                'iconDark' => $urlHelper->to('public/categories/iconsDark/Feature.svg'),
            ],
            'Section' => [
                'title' => 'Section',
                'elements' => [
                    'section',
                    'popupRoot',
                ],
                'icon' => $urlHelper->to('public/categories/icons/Section.svg'),
                'iconDark' => $urlHelper->to('public/categories/iconsDark/Section.svg'),
            ],
            'Theme Builder' => [
                'title' => 'Theme Builder',
                'elements' => [
                    'layoutContentArea',
                    'layoutWpCommentsArea',
                    'layoutPostTitle',
                    'layoutPostExcerpt',
                    'layoutPostDate',
                    'layoutPostAuthor',
                    'layoutPostAuthorImage',
                    'layoutPostAuthorBio',
                    'layoutPostCategories',
                    'layoutPostTags',
                    'layoutPostCustomFields',
                    'layoutPostFeaturedImage',
                    'logoWidget',
                    'layoutPostList',
                ],
                'icon' => $urlHelper->to('public/categories/icons/Section.svg'),
                'iconDark' => $urlHelper->to('public/categories/iconsDark/Section.svg'),
            ],
            'Hero section' => [
                'title' => 'Hero Section',
                'elements' => ['heroSection'],
                'icon' => $urlHelper->to('public/categories/icons/Hero-Section.svg'),
                'iconDark' => $urlHelper->to('public/categories/iconsDark/Hero-Section.svg'),
            ],
            'Icon' => [
                'title' => 'Icon',
                'elements' => ['icon', 'iconGroup'],
                'icon' => $urlHelper->to('public/categories/icons/Icon.svg'),
                'iconDark' => $urlHelper->to('public/categories/iconsDark/Icon.svg'),
            ],
            'Image Slider' => [
                'title' => 'Image Slider',
                'elements' => ['simpleImageSlider', 'logoSlider', 'timelineSlideshow'],
                'icon' => $urlHelper->to('public/categories/icons/Image-Slider.svg'),
                'iconDark' => $urlHelper->to('public/categories/iconsDark/Image-Slider.svg'),
            ],
            'Single image' => [
                'title' => 'Single Image',
                'elements' => ['singleImage', 'hoverImage', 'phoneMockup', 'browserMockup', 'parallaxSingleImage', 'giphy', 'gifAnimation'],
                'icon' => $urlHelper->to('public/categories/icons/Single-Image.svg'),
                'iconDark' => $urlHelper->to('public/categories/iconsDark/Single-Image.svg'),
            ],
            'Image gallery' => [
                'title' => 'Image Gallery',
                'elements' => [
                    'imageGallery',
                    'imageMasonryGallery',
                    'multipleImageCollage',
                    'imageMasonryGalleryWithZoom',
                    'imageMasonryGalleryWithIcon',
                    'imageMasonryGalleryWithScaleUp',
                    'imageGalleryWithIcon',
                    'imageGalleryWithScaleUp',
                    'imageGalleryWithZoom',
                ],
                'icon' => $urlHelper->to('public/categories/icons/Image-Gallery.svg'),
                'iconDark' => $urlHelper->to('public/categories/iconsDark/Image-Gallery.svg'),
            ],
            'Text block' => [
                'title' => 'Text Block',
                'elements' => ['textBlock', 'googleFontsHeading', 'typewriterHeading', 'marqueeElement', 'doubleTitle'],
                'icon' => $urlHelper->to('public/categories/icons/Text-Block.svg'),
                'iconDark' => $urlHelper->to('public/categories/iconsDark/Text-Block.svg'),
            ],
            'Misc' => [
                'title' => 'Misc',
                'elements' => [
                    'rawHtml',
                    'rawJs',
                    'demoElement',
                    'syntaxHighlighter',
                    'globalTemplate',
                    'timelineWithIcons',
                    'bannerElement',
                    'profileWithIcon',
                    'soundcloudPlayer',
                    'simpleContactForm',
                    'foodAndDrinksMenu',
                    'starRanking',
                ],
                'icon' => $urlHelper->to('public/categories/icons/Misc.svg'),
                'iconDark' => $urlHelper->to('public/categories/iconsDark/Misc.svg'),
            ],
            'Pricing table' => [
                'title' => 'Pricing Table',
                'elements' => [
                    'pricingTable',
                    'outlinePricingTable',
                    'shadowPricingTable',
                ],
                'icon' => $urlHelper->to('public/categories/icons/Pricing-Table.svg'),
                'iconDark' => $urlHelper->to('public/categories/iconsDark/Pricing-Table.svg'),
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
                    'socialProfileIcons',
                    'monoSocialIcons',
                ],
                'icon' => $urlHelper->to('public/categories/icons/Social.svg'),
                'iconDark' => $urlHelper->to('public/categories/iconsDark/Social.svg'),
            ],
            'Videos' => [
                'title' => 'Videos',
                'elements' => [
                    'youtubePlayer',
                    'vimeoPlayer',
                    'videoPlayer',
                    'videoPopup',
                    'videoButtonPopup',
                ],
                'icon' => $urlHelper->to('public/categories/icons/Video.svg'),
                'iconDark' => $urlHelper->to('public/categories/iconsDark/Video.svg'),
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
                    'cartIconWithCounter',
                ],
                'icon' => $urlHelper->to('public/categories/icons/WordPress.svg'),
                'iconDark' => $urlHelper->to('public/categories/iconsDark/WordPress.svg'),
            ],
            'Separators' => [
                'title' => 'Separators',
                'elements' => [
                    'separator',
                    'doubleSeparator',
                    'separatorIcon',
                    'separatorTitle',
                    'zigZagSeparator',
                ],
                'icon' => $urlHelper->to('public/categories/icons/Separator.svg'),
                'iconDark' => $urlHelper->to('public/categories/iconsDark/Separator.svg'),
            ],
            'Maps' => [
                'title' => 'Maps',
                'elements' => ['googleMaps'],
                'icon' => $urlHelper->to('public/categories/icons/Map.svg'),
                'iconDark' => $urlHelper->to('public/categories/iconsDark/Map.svg'),
            ],
            'Grids' => [
                'title' => 'Grids',
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
                    'layoutPostList',
                ],
                'icon' => $urlHelper->to('public/categories/icons/Post-Grid.svg'),
                'iconDark' => $urlHelper->to('public/categories/iconsDark/Post-Grid.svg'),
            ],
            '_postsGridSources' => [
                'title' => 'Post Grid Data Sources',
                'elements' => [
                    'postsGridDataSourceArchive',
                    'postsGridDataSourcePost',
                    'postsGridDataSourcePage',
                    'postsGridDataSourceCustomPostType',
                    'postsGridDataSourceListOfIds',
                ],
                'icon' => $urlHelper->to('public/categories/icons/Post-Grid.svg'),
                'iconDark' => $urlHelper->to('public/categories/iconsDark/Post-Grid.svg'),
            ],
            '_postsGridItems' => [
                'title' => 'Post Grid Item Post Description',
                'elements' => [
                    'postsGridItemPostDescription',
                    'featuredImagePostGridItem',
                    'centeredPostGridItem',
                    'postsSliderItem',
                    'slideOutPostGridItem',
                    'sidePostGridItem',
                    'newsPostGridItem',
                    'backgroundImagePostGridItem',
                    'portfolioPostGridItem',
                    'postGridWithBoxItem',
                    'postSliderBlockItem',
                    'postGridWithHoverButtonItem',
                ],
                'icon' => $urlHelper->to('public/categories/icons/Post-Grid.svg'),
                'iconDark' => $urlHelper->to('public/categories/iconsDark/Post-Grid.svg'),
            ],
            'Toggle' => [
                'title' => 'Toggle',
                'elements' => ['faqToggle', 'outlineFaqToggle'],
                'icon' => $urlHelper->to('public/categories/icons/Toggle.svg'),
                'iconDark' => $urlHelper->to('public/categories/iconsDark/Toggle.svg'),
            ],
            'Message Box' => [
                'title' => 'Message Box',
                'elements' => ['messageBox', 'outlineMessageBox', 'simpleMessageBox', 'semiFilledMessageBox'],
                'icon' => $urlHelper->to('public/categories/icons/Message-Box.svg'),
                'iconDark' => $urlHelper->to('public/categories/iconsDark/Message-Box.svg'),
            ],
            'Hover Box' => [
                'title' => 'Hover Box',
                'elements' => ['flipBox', 'hoverBox', 'iconHoverBox', 'tallHoverBox'],
                'icon' => $urlHelper->to('public/categories/icons/Hover-Box.svg'),
                'iconDark' => $urlHelper->to('public/categories/iconsDark/Hover-Box.svg'),
            ],
            'WordPress' => [
                'title' => 'WordPress',
                'elements' => [
                    'shortcode',
                    'addToAnyShareButtons',
                    'wpWidgetsCustom',
                    'wpWidgetsDefault',
                    'widgetizedSidebar',
                    'simpleSearch',
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
                    'hubSpotForms',
                ],
                'icon' => $urlHelper->to('public/categories/icons/WordPress.svg'),
                'iconDark' => $urlHelper->to('public/categories/iconsDark/WordPress.svg'),
            ],
            'Feature Description' => [
                'title' => 'Feature Description',
                'elements' => ['featureDescription'],
                'icon' => $urlHelper->to('public/categories/icons/Feature.svg'),
                'iconDark' => $urlHelper->to('public/categories/iconsDark/Feature.svg'),
            ],
            'Call To Action' => [
                'title' => 'Call To Action',
                'elements' => ['callToAction', 'simpleCallToAction', 'outlineCallToAction', 'callToActionWithIcon'],
                'icon' => $urlHelper->to('public/categories/icons/Call-To-Action.svg'),
                'iconDark' => $urlHelper->to('public/categories/iconsDark/Call-To-Action.svg'),
            ],
            'Empty Space' => [
                'title' => 'Empty Space',
                'elements' => ['emptySpace'],
                'icon' => $urlHelper->to('public/categories/icons/Misc.svg'),
                'iconDark' => $urlHelper->to('public/categories/iconsDark/Misc.svg'),
            ],
            'Testimonial' => [
                'title' => 'Testimonial',
                'elements' => [
                    'testimonial',
                    'basicTestimonial',
                    'starTestimonials',
                ],
                'icon' => $urlHelper->to('public/categories/icons/Testimonial.svg'),
                'iconDark' => $urlHelper->to('public/categories/iconsDark/Testimonial.svg'),
            ],
            'Accordions' => [
                'title' => 'Accordions',
                'elements' => ['classicAccordion'],
                'icon' => $urlHelper->to('public/categories/icons/Container.svg'),
                'iconDark' => $urlHelper->to('public/categories/iconsDark/Container.svg'),
            ],
            'Accordion Section' => [
                'title' => 'Accordion Section',
                'elements' => ['classicAccordionSection'],
                'icon' => $urlHelper->to('public/categories/icons/Container.svg'),
                'iconDark' => $urlHelper->to('public/categories/iconsDark/Container.svg'),
            ],
            'Charts' => [
                'title' => 'Charts',
                'elements' => ['progressBars'],
                'icon' => $urlHelper->to('public/categories/icons/Chart.svg'),
                'iconDark' => $urlHelper->to('public/categories/iconsDark/Chart.svg'),
            ],
            'Counter' => [
                'title' => 'Counter',
                'elements' => ['counterUp', 'countdownTimer'],
                'icon' => $urlHelper->to('public/categories/icons/Counter.svg'),
                'iconDark' => $urlHelper->to('public/categories/iconsDark/Counter.svg'),
            ],
        ];

        $hubCategories = $optionHelper->get('hubCategories', []);
        if (!empty($hubCategories)) {
            $categoriesDiffer->set($hubCategories);
        }

        $categoriesDiffer->onUpdate(
            [
                $hubCategoriesHelper,
                'updateCategory',
            ]
        )->set($defaultCategories);

        return $categoriesDiffer->get();
    }
}
