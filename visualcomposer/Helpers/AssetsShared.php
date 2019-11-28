<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Helper;

class AssetsShared extends Container implements Helper
{
    protected function renameLocalPath($name, $path)
    {
        return vchelper('Url')->to(str_replace('[publicPath]/', 'public/sources/assetsLibrary/' . $name . '/', $path));
    }

    public function getSharedAssets()
    {
        $assetsLibraries = $this->parseJsonFile([]);
        $assetsLibraries = $this->parseOptions($assetsLibraries);

        return vcfilter('vcv:helper:assetsShared:getLibraries', $assetsLibraries);
    }

    public function setSharedAssets($assets)
    {
        $optionsHelper = vchelper('Options');

        return $optionsHelper->set('assetsLibrary', $assets);
    }

    public function getPluginsAssetUrl($filePath = '')
    {
        if (preg_match('/^http/', $filePath)) {
            return set_url_scheme($filePath);
        }

        $url = set_url_scheme(VCV_PLUGIN_URL . 'public/sources/' . ltrim($filePath, '/\\'));

        return $url;
    }

    /**
     * Get relative path from absolute url
     *
     * @param $path
     *
     * @return mixed
     */
    public function relative($path)
    {
        $bundleUrl = $path;

        if (preg_match('/\/public\/sources\/assetsLibrary\//', $path)) {
            $url = $this->getPluginsAssetUrl();
            $url = str_replace(['http://', 'https://'], '', $url);
            $contentUrl = content_url() . '/public/sources/assetsLibrary/';
            $contentUrl = str_replace(['http://', 'https://'], '', $contentUrl);
            $path = str_replace(['http://', 'https://'], '', $path);

            if (strpos($path, $url) !== false) {
                $bundleUrl = str_replace($url, '', $path);
            } elseif (strpos($path, $contentUrl) !== false) {
                $bundleUrl = str_replace($contentUrl, '', $path);
            }
        }

        return $bundleUrl;
    }

    /**
     * Find new local assets path. Needed for BC
     *
     * @param $assetsPath
     *
     * @return mixed
     */
    public function findLocalAssetsPath($assetsPath)
    {
        $assets = [
            'elements/singleImage/singleImage/public/dist/lightbox.min.js' => 'assetsLibrary/lightbox/dist/lightbox.bundle.js',
            'elements/singleImage/singleImage/public/dist/jquery.zoom.min.js' => 'assetsLibrary/zoom/dist/zoom.bundle.js',
            'elements/simpleImageSlider/simpleImageSlider/public/dist/lightbox.min.js' => 'assetsLibrary/lightbox/dist/lightbox.bundle.js',
            'elements/imageGallery/imageGallery/public/dist/lightbox.min.js' => 'assetsLibrary/lightbox/dist/lightbox.bundle.js',
            'elements/imageGalleryWithIcon/imageGalleryWithIcon/public/dist/lightbox.min.js' => 'assetsLibrary/lightbox/dist/lightbox.bundle.js',
            'elements/imageGalleryWithScaleUp/imageGalleryWithScaleUp/public/dist/lightbox.min.js' => 'assetsLibrary/lightbox/dist/lightbox.bundle.js',
            'elements/imageGalleryWithZoom/imageGalleryWithZoom/public/dist/lightbox.min.js' => 'assetsLibrary/lightbox/dist/lightbox.bundle.js',
            'elements/imageMasonryGallery/imageMasonryGallery/public/dist/lightbox.min.js' => 'assetsLibrary/lightbox/dist/lightbox.bundle.js',
            'elements/imageMasonryGalleryWithIcon/imageMasonryGalleryWithIcon/public/dist/lightbox.min.js' => 'assetsLibrary/lightbox/dist/lightbox.bundle.js',
            'elements/imageMasonryGalleryWithScaleUp/imageMasonryGalleryWithScaleUp/public/dist/lightbox.min.js' => 'assetsLibrary/lightbox/dist/lightbox.bundle.js',
            'elements/imageMasonryGalleryWithZoom/imageMasonryGalleryWithZoom/public/dist/lightbox.min.js' => 'assetsLibrary/lightbox/dist/lightbox.bundle.js',

            'elements/singleImage/singleImage/public/dist/photoswipe.min.js' => 'assetsLibrary/photoswipe/dist/photoswipe.bundle.js',
            'elements/simpleImageSlider/simpleImageSlider/public/dist/photoswipe.min.js' => 'assetsLibrary/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageGallery/imageGallery/public/dist/photoswipe.min.js' => 'assetsLibrary/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageGalleryWithIcon/imageGalleryWithIcon/public/dist/photoswipe.min.js' => 'assetsLibrary/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageGalleryWithScaleUp/imageGalleryWithScaleUp/public/dist/photoswipe.min.js' => 'assetsLibrary/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageGalleryWithZoom/imageGalleryWithZoom/public/dist/photoswipe.min.js' => 'assetsLibrary/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageMasonryGallery/imageMasonryGallery/public/dist/photoswipe.min.js' => 'assetsLibrary/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageMasonryGalleryWithIcon/imageMasonryGalleryWithIcon/public/dist/photoswipe.min.js' => 'assetsLibrary/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageMasonryGalleryWithScaleUp/imageMasonryGalleryWithScaleUp/public/dist/photoswipe.min.js' => 'assetsLibrary/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageMasonryGalleryWithZoom/imageMasonryGalleryWithZoom/public/dist/photoswipe.min.js' => 'assetsLibrary/photoswipe/dist/photoswipe.bundle.js',

            'elements/singleImage/singleImage/public/dist/photoswipe-ui-default.min.js' => 'assetsLibrary/photoswipe/dist/photoswipe.bundle.js',
            'elements/simpleImageSlider/simpleImageSlider/public/dist/photoswipe-ui-default.min.js' => 'assetsLibrary/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageGallery/imageGallery/public/dist/photoswipe-ui-default.min.js' => 'assetsLibrary/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageGalleryWithIcon/imageGalleryWithIcon/public/dist/photoswipe-ui-default.min.js' => 'assetsLibrary/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageGalleryWithScaleUp/imageGalleryWithScaleUp/public/dist/photoswipe-ui-default.min.js' => 'assetsLibrary/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageGalleryWithZoom/imageGalleryWithZoom/public/dist/photoswipe-ui-default.min.js' => 'assetsLibrary/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageMasonryGallery/imageMasonryGallery/public/dist/photoswipe-ui-default.min.js' => 'assetsLibrary/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageMasonryGalleryWithIcon/imageMasonryGalleryWithIcon/public/dist/photoswipe-ui-default.min.js' => 'assetsLibrary/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageMasonryGalleryWithScaleUp/imageMasonryGalleryWithScaleUp/public/dist/photoswipe-ui-default.min.js' => 'assetsLibrary/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageMasonryGalleryWithZoom/imageMasonryGalleryWithZoom/public/dist/photoswipe-ui-default.min.js' => 'assetsLibrary/photoswipe/dist/photoswipe.bundle.js',

            'elements/singleImage/singleImage/public/dist/photoswipe-init.min.js' => 'assetsLibrary/photoswipe/dist/photoswipe.bundle.js',
            'elements/simpleImageSlider/simpleImageSlider/public/dist/photoswipe-init.min.js' => 'assetsLibrary/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageGallery/imageGallery/public/dist/photoswipe-init.min.js' => 'assetsLibrary/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageGalleryWithIcon/imageGalleryWithIcon/public/dist/photoswipe-init.min.js' => 'assetsLibrary/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageGalleryWithScaleUp/imageGalleryWithScaleUp/public/dist/photoswipe-init.min.js' => 'assetsLibrary/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageGalleryWithZoom/imageGalleryWithZoom/public/dist/photoswipe-init.min.js' => 'assetsLibrary/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageMasonryGallery/imageMasonryGallery/public/dist/photoswipe-init.min.js' => 'assetsLibrary/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageMasonryGalleryWithIcon/imageMasonryGalleryWithIcon/public/dist/photoswipe-init.min.js' => 'assetsLibrary/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageMasonryGalleryWithScaleUp/imageMasonryGalleryWithScaleUp/public/dist/photoswipe-init.min.js' => 'assetsLibrary/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageMasonryGalleryWithZoom/imageMasonryGalleryWithZoom/public/dist/photoswipe-init.min.js' => 'assetsLibrary/photoswipe/dist/photoswipe.bundle.js',

            'elements/faqToggle/faqToggle/public/dist/faqToggle.min.js' => [
                'sharedLibraries/faqToggle/dist/faqToggle.bundle.js', // shared-library
                'elements/faqToggle/faqToggle/public/dist/faqToggle.min.js' // initializator
            ],
            'elements/outlineFaqToggle/outlineFaqToggle/public/dist/faqToggle.min.js' => [
                'sharedLibraries/faqToggle/dist/faqToggle.bundle.js', // shared-library
                'elements/outlineFaqToggle/outlineFaqToggle/public/dist/outlineFaqToggle.min.js' // initializator
            ],

            'elements/row/row/public/dist/fullHeightRow.min.js' => 'assetsLibrary/fullHeight/dist/fullHeight.bundle.js',
            'elements/row/row/public/dist/fullWidthRow.min.js' => 'assetsLibrary/fullWidth/dist/fullWidth.bundle.js',

            'elements/section/section/public/dist/fullWidthSection.min.js' => 'assetsLibrary/fullWidth/dist/fullWidth.bundle.js',

            'elements/logoSlider/logoSlider/public/dist/slick.custom.min.js' => 'sharedLibraries/slickSlider/dist/slickCustom.bundle.js',
            'elements/postsSlider/postsSlider/public/dist/slick.custom.min.js' => 'sharedLibraries/slickSlider/dist/slickCustom.bundle.js',
            'elements/simpleImageSlider/simpleImageSlider/public/dist/slick.custom.min.js' => 'sharedLibraries/slickSlider/dist/slickCustom.bundle.js',

            'elements/sandwichMenu/sandwichMenu/public/dist/sandwichMenu.min.js' => [
                'sharedLibraries/menuToggle/dist/menuToggle.bundle.js', // shared-library
                'elements/sandwichMenu/sandwichMenu/public/dist/sandwichMenu.min.js' // initializator
            ],
            'assetsLibrary/iconpicker/dist/iconpicker.bundle.css' => [
                'sharedLibraries/iconpicker/dist/batch.bundle.css',
                'sharedLibraries/iconpicker/dist/dripicons.bundle.css',
                'sharedLibraries/iconpicker/dist/entypo.bundle.css',
                'sharedLibraries/iconpicker/dist/feather.bundle.css',
                'sharedLibraries/iconpicker/dist/fontawesome.bundle.css',
                'sharedLibraries/iconpicker/dist/linearicons.bundle.css',
                'sharedLibraries/iconpicker/dist/lineicons.bundle.css',
                'sharedLibraries/iconpicker/dist/material.bundle.css',
                'sharedLibraries/iconpicker/dist/metrize.bundle.css',
                'sharedLibraries/iconpicker/dist/mfglabs.bundle.css',
                'sharedLibraries/iconpicker/dist/monosocial.bundle.css',
                'sharedLibraries/iconpicker/dist/openiconic.bundle.css',
                'sharedLibraries/iconpicker/dist/socials.bundle.css',
                'sharedLibraries/iconpicker/dist/typicons.bundle.css',
            ],
            'sharedLibraries/iconpicker/dist/iconpicker.bundle.css' => [
                'sharedLibraries/iconpicker/dist/batch.bundle.css',
                'sharedLibraries/iconpicker/dist/dripicons.bundle.css',
                'sharedLibraries/iconpicker/dist/entypo.bundle.css',
                'sharedLibraries/iconpicker/dist/feather.bundle.css',
                'sharedLibraries/iconpicker/dist/fontawesome.bundle.css',
                'sharedLibraries/iconpicker/dist/linearicons.bundle.css',
                'sharedLibraries/iconpicker/dist/lineicons.bundle.css',
                'sharedLibraries/iconpicker/dist/material.bundle.css',
                'sharedLibraries/iconpicker/dist/metrize.bundle.css',
                'sharedLibraries/iconpicker/dist/mfglabs.bundle.css',
                'sharedLibraries/iconpicker/dist/monosocial.bundle.css',
                'sharedLibraries/iconpicker/dist/openiconic.bundle.css',
                'sharedLibraries/iconpicker/dist/socials.bundle.css',
                'sharedLibraries/iconpicker/dist/typicons.bundle.css',
            ],

            // BC: ClassicTabs to new tabs assets
            'elements/classicTabs/classicTabs/public/dist/vc-classic-tabs-accordion.min.js' => 'assetsLibrary/accordion/dist/accordion.bundle.js',
            'elements/classicTabs/classicTabs/public/dist/vc-classic-tabs-tabs.min.js' => [
                'assetsLibrary/tabs/dist/tabs.bundle.js',
                'elements/classicTabs/classicTabs/public/dist/vcClassicTabs.min.js',
            ],
            'elements/classicTabs/classicTabs/public/dist/vc-classic-tabs-accordion-autoplay.min.js' => 'assetsLibrary/accordionAutoplay/dist/accordionAutoplay.bundle.js',

            // BC: ClassicAccordion
            'elements/classicAccordion/classicAccordion/public/dist/vc-classic-accordion.min.js' => [
                'assetsLibrary/accordion/dist/accordion.bundle.js',
                'elements/classicAccordion/classicAccordion/public/dist/vcClassicAccordion.min.js',
            ],
            'elements/classicAccordion/classicAccordion/public/dist/vc-classic-accordion-autoplay.min.js' => 'assetsLibrary/accordionAutoplay/dist/accordionAutoplay.bundle.js',

            // BC: tabsWithSlide
            'elements/tabsWithSlide/tabsWithSlide/public/dist/vc-accordion.min.js' => 'assetsLibrary/accordion/dist/accordion.bundle.js',
            'elements/tabsWithSlide/tabsWithSlide/public/dist/vc-tabs.min.js' => [
                'assetsLibrary/tabs/dist/tabs.bundle.js',
                'elements/tabsWithSlide/tabsWithSlide/public/dist/vcTabsWithSlide.min.js',
            ],
            'elements/tabsWithSlide/tabsWithSlide/public/dist/vc-accordion-autoplay.min.js' => 'assetsLibrary/accordionAutoplay/dist/accordionAutoplay.bundle.js',
        ];

        $output = $assetsPath;

        if (isset($assets[ $assetsPath ])) {
            $output = $assets[ $assetsPath ];
        }

        $output = vcfilter('vcv:helpers:assetsShared:findLocalAssetsPath', $output, [$assetsPath]);

        return $output;
    }

    /**
     * @param $assetsLibraries
     *
     * @return array
     */
    protected function parseJsonFile($assetsLibraries)
    {
        $json = vchelper('File')->getContents(
            VCV_PLUGIN_DIR_PATH . 'public/sources/assetsLibrary/assetsLibraries.json'
        );
        $data = json_decode($json);
        if (isset($data->assetsLibrary) && is_array($data->assetsLibrary)) {
            foreach ($data->assetsLibrary as $asset) {
                if (isset($asset->name)) {
                    $name = $asset->name;
                    $assetsLibraries[ $name ] = [
                        'dependencies' => $asset->dependencies,
                        'jsBundle' => isset($asset->jsBundle) ? add_query_arg(
                            'v',
                            VCV_VERSION,
                            $this->renameLocalPath(
                                $name,
                                $asset->jsBundle
                            )
                        ) : '',
                        'cssBundle' => isset($asset->cssBundle) ? add_query_arg(
                            'v',
                            VCV_VERSION,
                            $this->renameLocalPath(
                                $name,
                                $asset->cssBundle
                            )
                        ) : '',
                    ];

                    if (isset($asset->cssSubsetBundles)) {
                        $cssSubsetBundles = [];
                        foreach ($asset->cssSubsetBundles as $singleKey => $single) {
                            $cssSubsetBundles[ $singleKey ] = add_query_arg(
                                'v',
                                VCV_VERSION,
                                $this->renameLocalPath($name, $single)
                            );
                        }
                        $assetsLibraries[ $name ]['cssSubsetBundles'] = $cssSubsetBundles;
                    }
                }
            }
        }

        return $assetsLibraries;
    }

    /**
     * @param $assetsLibraries
     *
     * @return mixed
     */
    protected function parseOptions($assetsLibraries)
    {
        if (vcvenv('VCV_ENV_EXTENSION_DOWNLOAD')) {
            $optionsHelper = vchelper('Options');
            $assets = $optionsHelper->get('assetsLibrary', []);
            $assetsHelper = vchelper('Assets');
            foreach ($assets as $key => $value) {
                if (!isset($assetsLibraries[ $key ])) {
                    if (isset($value['jsBundle'])) {
                        $value['jsBundle'] = add_query_arg(
                            'v',
                            VCV_VERSION,
                            $assetsHelper->getAssetUrl($value['jsBundle'])
                        );
                    }
                    if (isset($value['cssBundle'])) {
                        $value['cssBundle'] = add_query_arg(
                            'v',
                            VCV_VERSION,
                            $assetsHelper->getAssetUrl($value['cssBundle'])
                        );
                    }
                    $assetsLibraries[ $key ] = $value;

                    if (isset($value['cssSubsetBundles'])) {
                        $cssSubsetBundles = [];
                        foreach ($value['cssSubsetBundles'] as $singleKey => $single) {
                            $cssSubsetBundles[ $singleKey ] = add_query_arg(
                                'v',
                                VCV_VERSION,
                                $assetsHelper->getAssetUrl($single)
                            );
                        }
                        $assetsLibraries[ $key ]['cssSubsetBundles'] = $cssSubsetBundles;
                    }
                }
            }
        }

        return $assetsLibraries;
    }
}
