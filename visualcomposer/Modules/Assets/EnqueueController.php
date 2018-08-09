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
use VisualComposer\Helpers\AssetsShared;
use VisualComposer\Helpers\Frontend;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Str;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class EnqueueController extends Container implements Module
{
    use WpFiltersActions;

    protected $lastEnqueueIdSourceAssets = null;

    protected $lastEnqueueIdAssets = null;

    public function __construct(Frontend $frontendHelper)
    {
        $actionPriority = 50;
        $this->wpAddAction('wp_enqueue_scripts', 'enqueueGlobalAssets', $actionPriority);
        $this->wpAddAction('wp_enqueue_scripts', 'enqueueAssets', $actionPriority);
        $this->wpAddAction('wp_enqueue_scripts', 'enqueueSourceAssets', $actionPriority);
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
        if ($frontendHelper->isPageEditable() && !vcvenv('VCV_FT_INITIAL_CSS_LOAD')) {
            return;
        }
        if ($frontendHelper->isPreview()
            && (!$this->lastEnqueueIdSourceAssets
                || ($this->lastEnqueueIdSourceAssets === get_the_ID()))) {
            $this->lastEnqueueIdSourceAssets = get_the_ID();

            return;
        }
        $this->lastEnqueueIdSourceAssets = get_the_ID();
        $sourceId = get_the_ID();
        $bundleUrl = get_post_meta($sourceId, 'vcvSourceCssFileUrl', true);
        if ($bundleUrl) {
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
     * @param \VisualComposer\Helpers\AssetsShared $assetsSharedHelper
     *
     * @throws \ReflectionException
     */
    protected function enqueueAssets(
        Str $strHelper,
        Frontend $frontendHelper,
        Assets $assetsHelper,
        AssetsShared $assetsSharedHelper
    ) {
        if ($frontendHelper->isPageEditable() && !vcvenv('VCV_FT_INITIAL_CSS_LOAD')) {
            return;
        }
        if ($frontendHelper->isPreview()
            && (!$this->lastEnqueueIdAssets
                || ($this->lastEnqueueIdAssets === get_the_ID()))) {
            $this->lastEnqueueIdAssets = get_the_ID();

            return;
        }
        $this->lastEnqueueIdAssets = get_the_ID();
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
                $asset = $assetsSharedHelper->findLocalAssetsPath($asset);
                foreach ((array)$asset as $single) {
                    wp_enqueue_script(
                        'vcv:assets:source:scripts:' . $strHelper->slugify($single),
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
}
