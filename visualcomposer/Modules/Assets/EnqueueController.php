<?php

namespace VisualComposer\Modules\Assets;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Assets;
use VisualComposer\Helpers\Frontend;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Str;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class EnqueueController extends Container implements Module
{
    use WpFiltersActions;

    public function __construct(Frontend $frontendHelper)
    {
        $actionPriority = 50;
        $this->wpAddAction('wp_enqueue_scripts', 'enqueueGlobalAssets', $actionPriority);
        if (!$frontendHelper->isPreview()) {
            $this->wpAddAction('wp_enqueue_scripts', 'enqueueAssets', $actionPriority);
            $this->wpAddAction('wp_enqueue_scripts', 'enqueueSourceAssets', $actionPriority);
        }
    }

    /**
     * @param \VisualComposer\Helpers\Options $optionsHelper
     * @param \VisualComposer\Helpers\Str $strHelper
     * @param \VisualComposer\Helpers\Assets $assetsHelper
     */
    protected function enqueueGlobalAssets(
        Options $optionsHelper,
        Str $strHelper,
        Assets $assetsHelper
    ) {
        $bundleUrl = $optionsHelper->get('globalElementsCssFileUrl');
        if ($bundleUrl) {
            $version = $optionsHelper->get('globalElementsCssHash', VCV_VERSION);
            if (!preg_match('/^http/', $bundleUrl)) {
                if (!preg_match('/assets-bundles/', $bundleUrl)) {
                    $bundleUrl = '/assets-bundles/' . $bundleUrl;
                }
            }
            wp_enqueue_style(
                'vcv:assets:global:styles:' . $strHelper->slugify($bundleUrl),
                $assetsHelper->getAssetUrl($bundleUrl),
                [],
                VCV_VERSION . '.' . $version
            );
        }
    }

    /**
     * @param \VisualComposer\Helpers\Str $strHelper
     * @param \VisualComposer\Helpers\Frontend $frontendHelper
     * @param \VisualComposer\Helpers\Assets $assetsHelper
     */
    protected function enqueueSourceAssets(Str $strHelper, Frontend $frontendHelper, Assets $assetsHelper)
    {
        $sourceId = get_the_ID();
        $bundleUrl = get_post_meta($sourceId, 'vcvSourceCssFileUrl', true);
        if ($bundleUrl && !$frontendHelper->isPageEditable()) {
            $version = get_post_meta($sourceId, 'vcvSourceCssFileHash', true);
            if (!preg_match('/^http/', $bundleUrl)) {
                if (!preg_match('/assets-bundles/', $bundleUrl)) {
                    $bundleUrl = '/assets-bundles/' . $bundleUrl;
                }
            }

            wp_enqueue_style(
                'vcv:assets:source:main:styles:' . $strHelper->slugify($bundleUrl),
                $assetsHelper->getAssetUrl($bundleUrl),
                [],
                VCV_VERSION . '.' . $version
            );
        }
    }

    /**
     * @param \VisualComposer\Helpers\Str $strHelper
     * @param \VisualComposer\Helpers\Frontend $frontendHelper
     * @param \VisualComposer\Helpers\Assets $assetsHelper
     *
     * @throws \ReflectionException
     */
    protected function enqueueAssets(Str $strHelper, Frontend $frontendHelper, Assets $assetsHelper)
    {
        if ($frontendHelper->isPageEditable()) {
            return;
        }
        $sourceId = get_the_ID();
        $assetsFiles = get_post_meta($sourceId, 'vcvSourceAssetsFiles', true);

        if (!is_array($assetsFiles)) {
            return;
        }

        if (isset($assetsFiles['cssBundles']) && is_array($assetsFiles['cssBundles'])) {
            foreach ($assetsFiles['cssBundles'] as $asset) {
                wp_enqueue_style(
                    'vcv:assets:source:styles:' . $strHelper->slugify($asset),
                    $assetsHelper->getAssetUrl($asset),
                    [],
                    VCV_VERSION
                );
            }
            unset($asset);
        }

        if (isset($assetsFiles['jsBundles']) && is_array($assetsFiles['jsBundles'])) {
            foreach ($assetsFiles['jsBundles'] as $asset) {
                $asset = $this->call('findLocalAssetsPath', [$asset]);
                foreach ((array)$asset as $single) {
                    wp_enqueue_script(
                        'vcsv:assets:source:scripts:' . $strHelper->slugify($single),
                        $assetsHelper->getAssetUrl($single),
                        [],
                        VCV_VERSION,
                        true
                    );
                }
            }
            unset($asset);
        }
    }

    /**
     * Find new local assets path. Needed for BC
     *
     * @param $assetsPath
     *
     * @return mixed
     */
    protected function findLocalAssetsPath($assetsPath)
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
