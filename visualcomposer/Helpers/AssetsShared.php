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
    protected function parsePath($name, $path)
    {
        return vchelper('Url')->to(str_replace('[publicPath]/', 'public/sources/assetsLibrary/' . $name . '/', $path));
    }

    public function getSharedAssets()
    {
        if (vcvenv('VCV_ENV_EXTENSION_DOWNLOAD')) {
            $optionsHelper = vchelper('Options');
            $assets = $optionsHelper->get('assetsLibrary', []);
            $assetsHelper = vchelper('Assets');
            foreach ($assets as $key => $value) {
                if (isset($value['jsBundle'])) {
                    $value['jsBundle'] = $assetsHelper->getAssetUrl($value['jsBundle']);
                    $assets[ $key ] = $value;
                }
                if (isset($value['cssBundle'])) {
                    $value['cssBundle'] = $assetsHelper->getAssetUrl($value['cssBundle']);
                    $assets[ $key ] = $value;
                }
            }

            return $assets;
        } else {
            $urlHelper = vchelper('Url');
            if (vcvenv('VCV_TF_ASSETS_LIBRARY_JSON_FILE')) {
                $assetsLibraries = [];
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
                                'jsBundle' => isset($asset->jsBundle) ? $this->parsePath($name, $asset->jsBundle) : '',
                                'cssBundle' => isset($asset->cssBundle) ? $this->parsePath($name, $asset->cssBundle)
                                    : '',
                            ];
                        }
                    }
                }

                return $assetsLibraries;
            }

            return [
                'waypoints' => [
                    'dependencies' => [],
                    'jsBundle' => $urlHelper->to(
                        'public/sources/assetsLibrary/waypoints/dist/noframework.waypoints.min.js'
                    ),
                ],
                'animate' => [
                    'dependencies' => ['waypoints'],
                    'jsBundle' => $urlHelper->to('public/sources/assetsLibrary/animate/dist/animate.bundle.js'),
                    'cssBundle' => $urlHelper->to('public/sources/assetsLibrary/animate/dist/animate.bundle.css'),
                ],
                'backgroundColorGradient' => [
                    'dependencies' => [],
                    'cssBundle' => $urlHelper->to(
                        'public/sources/assetsLibrary/backgroundColorGradient/dist/backgroundColorGradient.bundle.css'
                    ),
                ],
                'backgroundSimple' => [
                    'dependencies' => [],
                    'cssBundle' => $urlHelper->to(
                        'public/sources/assetsLibrary/backgroundSimple/dist/backgroundSimple.bundle.css'
                    ),
                ],
                'backgroundZoom' => [
                    'dependencies' => [],
                    'jsBundle' => $urlHelper->to(
                        'public/sources/assetsLibrary/backgroundZoom/dist/backgroundZoom.bundle.js'
                    ),
                    'cssBundle' => $urlHelper->to(
                        'public/sources/assetsLibrary/backgroundZoom/dist/backgroundZoom.bundle.css'
                    ),
                ],
                'backgroundSlider' => [
                    'dependencies' => [],
                    'jsBundle' => $urlHelper->to(
                        'public/sources/assetsLibrary/backgroundSlider/dist/backgroundSlider.bundle.js'
                    ),
                    'cssBundle' => $urlHelper->to(
                        'public/sources/assetsLibrary/backgroundSlider/dist/backgroundSlider.bundle.css'
                    ),
                ],
                'backgroundVideoEmbed' => [
                    'dependencies' => [],
                    'jsBundle' => $urlHelper->to(
                        'public/sources/assetsLibrary/backgroundVideoEmbed/dist/backgroundVideoEmbed.bundle.js'
                    ),
                    'cssBundle' => $urlHelper->to(
                        'public/sources/assetsLibrary/backgroundVideoEmbed/dist/backgroundVideoEmbed.bundle.css'
                    ),
                ],
                'backgroundVideoVimeo' => [
                    'dependencies' => [],
                    'jsBundle' => $urlHelper->to(
                        'public/sources/assetsLibrary/backgroundVideoVimeo/dist/backgroundVideoVimeo.bundle.js'
                    ),
                    'cssBundle' => $urlHelper->to(
                        'public/sources/assetsLibrary/backgroundVideoVimeo/dist/backgroundVideoVimeo.bundle.css'
                    ),
                ],
                'backgroundVideoYoutube' => [
                    'dependencies' => [],
                    'jsBundle' => $urlHelper->to(
                        'public/sources/assetsLibrary/backgroundVideoYoutube/dist/backgroundVideoYoutube.bundle.js'
                    ),
                    'cssBundle' => $urlHelper->to(
                        'public/sources/assetsLibrary/backgroundVideoYoutube/dist/backgroundVideoYoutube.bundle.css'
                    ),
                ],
                'parallaxBackground' => [
                    'dependencies' => ['waypoints'],
                    'jsBundle' => $urlHelper->to(
                        'public/sources/assetsLibrary/parallaxBackground/dist/parallaxBackground.bundle.js'
                    ),
                    'cssBundle' => $urlHelper->to(
                        'public/sources/assetsLibrary/parallaxBackground/dist/parallaxBackground.bundle.css'
                    ),
                ],
                'parallaxFade' => [
                    'dependencies' => ['waypoints'],
                    'jsBundle' => $urlHelper->to(
                        'public/sources/assetsLibrary/parallaxFade/dist/parallaxFade.bundle.js'
                    ),
                ],
                'parallaxMouseMove' => [
                    'dependencies' => [],
                    'jsBundle' => $urlHelper->to(
                        'public/sources/assetsLibrary/parallaxMouseMove/dist/parallaxMouseMove.bundle.js'
                    ),
                    'cssBundle' => $urlHelper->to(
                        'public/sources/assetsLibrary/parallaxMouseMove/dist/parallaxMouseMove.bundle.css'
                    ),
                ],
                'iconpicker' => [
                    'dependencies' => [],
                    'cssBundle' => $urlHelper->to('public/sources/assetsLibrary/iconpicker/dist/iconpicker.bundle.css'),
                ],
                'divider' => [
                    'dependencies' => ['backgroundVideoEmbed', 'backgroundVideoYoutube', 'backgroundVideoVimeo'],
                    'cssBundle' => $urlHelper->to('public/sources/assetsLibrary/divider/dist/divider.bundle.css'),
                ],
                'imageFilter' => [
                    'dependencies' => [],
                    'cssBundle' => $urlHelper->to(
                        'public/sources/assetsLibrary/imageFilter/dist/imageFilter.bundle.css'
                    ),
                ],
            ];
        }
    }

    public function setSharedAssets($assets)
    {
        $optionsHelper = vchelper('Options');

        return $optionsHelper->set('assetsLibrary', $assets);
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
            'elements/singleImage/singleImage/public/dist/lightbox.min.js' => 'sharedLibraries/lightbox/dist/lightbox.bundle.js',
            'elements/singleImage/singleImage/public/dist/jquery.zoom.min.js' => 'sharedLibraries/zoom/dist/zoom.bundle.js',
            'elements/simpleImageSlider/simpleImageSlider/public/dist/lightbox.min.js' => 'sharedLibraries/lightbox/dist/lightbox.bundle.js',
            'elements/imageGallery/imageGallery/public/dist/lightbox.min.js' => 'sharedLibraries/lightbox/dist/lightbox.bundle.js',
            'elements/imageGalleryWithIcon/imageGalleryWithIcon/public/dist/lightbox.min.js' => 'sharedLibraries/lightbox/dist/lightbox.bundle.js',
            'elements/imageGalleryWithScaleUp/imageGalleryWithScaleUp/public/dist/lightbox.min.js' => 'sharedLibraries/lightbox/dist/lightbox.bundle.js',
            'elements/imageGalleryWithZoom/imageGalleryWithZoom/public/dist/lightbox.min.js' => 'sharedLibraries/lightbox/dist/lightbox.bundle.js',
            'elements/imageMasonryGallery/imageMasonryGallery/public/dist/lightbox.min.js' => 'sharedLibraries/lightbox/dist/lightbox.bundle.js',
            'elements/imageMasonryGalleryWithIcon/imageMasonryGalleryWithIcon/public/dist/lightbox.min.js' => 'sharedLibraries/lightbox/dist/lightbox.bundle.js',
            'elements/imageMasonryGalleryWithScaleUp/imageMasonryGalleryWithScaleUp/public/dist/lightbox.min.js' => 'sharedLibraries/lightbox/dist/lightbox.bundle.js',
            'elements/imageMasonryGalleryWithZoom/imageMasonryGalleryWithZoom/public/dist/lightbox.min.js' => 'sharedLibraries/lightbox/dist/lightbox.bundle.js',

            'elements/singleImage/singleImage/public/dist/photoswipe.min.js' => 'sharedLibraries/photoswipe/dist/photoswipe.bundle.js',
            'elements/simpleImageSlider/simpleImageSlider/public/dist/photoswipe.min.js' => 'sharedLibraries/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageGallery/imageGallery/public/dist/photoswipe.min.js' => 'sharedLibraries/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageGalleryWithIcon/imageGalleryWithIcon/public/dist/photoswipe.min.js' => 'sharedLibraries/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageGalleryWithScaleUp/imageGalleryWithScaleUp/public/dist/photoswipe.min.js' => 'sharedLibraries/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageGalleryWithZoom/imageGalleryWithZoom/public/dist/photoswipe.min.js' => 'sharedLibraries/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageMasonryGallery/imageMasonryGallery/public/dist/photoswipe.min.js' => 'sharedLibraries/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageMasonryGalleryWithIcon/imageMasonryGalleryWithIcon/public/dist/photoswipe.min.js' => 'sharedLibraries/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageMasonryGalleryWithScaleUp/imageMasonryGalleryWithScaleUp/public/dist/photoswipe.min.js' => 'sharedLibraries/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageMasonryGalleryWithZoom/imageMasonryGalleryWithZoom/public/dist/photoswipe.min.js' => 'sharedLibraries/photoswipe/dist/photoswipe.bundle.js',

            'elements/singleImage/singleImage/public/dist/photoswipe-ui-default.min.js' => 'sharedLibraries/photoswipe/dist/photoswipe.bundle.js',
            'elements/simpleImageSlider/simpleImageSlider/public/dist/photoswipe-ui-default.min.js' => 'sharedLibraries/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageGallery/imageGallery/public/dist/photoswipe-ui-default.min.js' => 'sharedLibraries/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageGalleryWithIcon/imageGalleryWithIcon/public/dist/photoswipe-ui-default.min.js' => 'sharedLibraries/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageGalleryWithScaleUp/imageGalleryWithScaleUp/public/dist/photoswipe-ui-default.min.js' => 'sharedLibraries/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageGalleryWithZoom/imageGalleryWithZoom/public/dist/photoswipe-ui-default.min.js' => 'sharedLibraries/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageMasonryGallery/imageMasonryGallery/public/dist/photoswipe-ui-default.min.js' => 'sharedLibraries/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageMasonryGalleryWithIcon/imageMasonryGalleryWithIcon/public/dist/photoswipe-ui-default.min.js' => 'sharedLibraries/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageMasonryGalleryWithScaleUp/imageMasonryGalleryWithScaleUp/public/dist/photoswipe-ui-default.min.js' => 'sharedLibraries/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageMasonryGalleryWithZoom/imageMasonryGalleryWithZoom/public/dist/photoswipe-ui-default.min.js' => 'sharedLibraries/photoswipe/dist/photoswipe.bundle.js',

            'elements/singleImage/singleImage/public/dist/photoswipe-init.min.js' => 'sharedLibraries/photoswipe/dist/photoswipe.bundle.js',
            'elements/simpleImageSlider/simpleImageSlider/public/dist/photoswipe-init.min.js' => 'sharedLibraries/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageGallery/imageGallery/public/dist/photoswipe-init.min.js' => 'sharedLibraries/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageGalleryWithIcon/imageGalleryWithIcon/public/dist/photoswipe-init.min.js' => 'sharedLibraries/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageGalleryWithScaleUp/imageGalleryWithScaleUp/public/dist/photoswipe-init.min.js' => 'sharedLibraries/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageGalleryWithZoom/imageGalleryWithZoom/public/dist/photoswipe-init.min.js' => 'sharedLibraries/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageMasonryGallery/imageMasonryGallery/public/dist/photoswipe-init.min.js' => 'sharedLibraries/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageMasonryGalleryWithIcon/imageMasonryGalleryWithIcon/public/dist/photoswipe-init.min.js' => 'sharedLibraries/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageMasonryGalleryWithScaleUp/imageMasonryGalleryWithScaleUp/public/dist/photoswipe-init.min.js' => 'sharedLibraries/photoswipe/dist/photoswipe.bundle.js',
            'elements/imageMasonryGalleryWithZoom/imageMasonryGalleryWithZoom/public/dist/photoswipe-init.min.js' => 'sharedLibraries/photoswipe/dist/photoswipe.bundle.js',

            'elements/faqToggle/faqToggle/public/dist/faqToggle.min.js' => [
                'sharedLibraries/faqToggle/dist/faqToggle.bundle.js', // shared-library
                'elements/faqToggle/faqToggle/public/dist/faqToggle.min.js' // initializator
            ],
            'elements/outlineFaqToggle/outlineFaqToggle/public/dist/faqToggle.min.js' => [
                'sharedLibraries/faqToggle/dist/faqToggle.bundle.js', // shared-library
                'elements/outlineFaqToggle/outlineFaqToggle/public/dist/outlineFaqToggle.min.js' // initializator
            ],

            'elements/row/row/public/dist/fullHeightRow.min.js' => 'sharedLibraries/fullHeight/dist/fullHeight.bundle.js',
            'elements/row/row/public/dist/fullWidthRow.min.js' => 'sharedLibraries/fullWidth/dist/fullWidth.bundle.js',

            'elements/section/section/public/dist/fullWidthSection.min.js' => 'sharedLibraries/fullWidth/dist/fullWidth.bundle.js',

            'elements/logoSlider/logoSlider/public/dist/slick.custom.min.js' => 'sharedLibraries/slickSlider/dist/slickCustom.bundle.js',
            'elements/postsSlider/postsSlider/public/dist/slick.custom.min.js' => 'sharedLibraries/slickSlider/dist/slickCustom.bundle.js',
            'elements/simpleImageSlider/simpleImageSlider/public/dist/slick.custom.min.js' => 'sharedLibraries/slickSlider/dist/slickCustom.bundle.js',
            'elements/pageableContainer/pageableContainer/public/dist/slick.custom.min.js' => 'sharedLibraries/slickSlider/dist/slickCustom.bundle.js',
        ];

        if (isset($assets[ $assetsPath ])) {
            return $assets[ $assetsPath ];
        }

        return $assetsPath;
    }
}
