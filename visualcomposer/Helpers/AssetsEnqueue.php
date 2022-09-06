<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;
use VisualComposer\Framework\Container;

class AssetsEnqueue extends Container implements Helper
{
    /**
     * @var array
     */
    protected $sourcesList = [];

    /**
     * @var array
     */
    protected $doneList = [];

    /**
     * @param $sourceId
     *
     * @return void
     */
    public function addToEnqueueList($sourceId)
    {
        $this->sourcesList[] = $sourceId;
    }

    /**
     * @param $sourceId
     *
     * @return void
     */
    public function removeFromList($sourceId)
    {
        if ($this->sourcesList && in_array($sourceId, $this->sourcesList)) {
            $sourceKey = array_search($sourceId, $this->sourcesList);
            unset($this->sourcesList[ $sourceKey ]);
            $rebaseKeys = array_values($this->sourcesList); // Resetting the array keys
            $this->sourcesList = $rebaseKeys;
        }
    }

    /**
     * @return array
     */
    public function getEnqueueList()
    {
        return array_unique($this->sourcesList);
    }

    /**
     * @param $sourceId
     *
     * @return void
     * @throws \VisualComposer\Framework\Illuminate\Container\BindingResolutionException
     */
    public function enqueueAssets($sourceId)
    {
        $assetsSharedHelper = vchelper('AssetsShared');
        $strHelper = vchelper('Str');
        $assetsFiles = get_post_meta($sourceId, 'vcvSourceAssetsFiles', true);

        if (!is_array($assetsFiles)) {
            return;
        }

        if (isset($assetsFiles['cssBundles']) && is_array($assetsFiles['cssBundles'])) {
            foreach ($assetsFiles['cssBundles'] as $asset) {
                $asset = $assetsSharedHelper->findLocalAssetsPath($asset);
                foreach ((array)$asset as $single) {
                    $assetData = $this->getAssetData($single);
                    $styleName = 'vcv:assets:source:styles:' . $strHelper->slugify($assetData['asset']);

                    if (!wp_style_is($styleName, 'enqueued')) {
                        wp_enqueue_style(
                            $styleName,
                            $assetData['url'],
                            [],
                            $assetData['version'] . '-' . $sourceId
                        );
                    }
                }
            }
            unset($asset);
        }

        if (isset($assetsFiles['jsBundles']) && is_array($assetsFiles['jsBundles'])) {
            foreach ($assetsFiles['jsBundles'] as $asset) {
                $asset = $assetsSharedHelper->findLocalAssetsPath($asset);
                foreach ((array)$asset as $single) {
                    $assetData = $this->getAssetData($single);
                    $scriptName = 'vcv:assets:source:scripts:' . $strHelper->slugify($assetData['asset']);

                    if (!wp_script_is($scriptName, 'enqueued')) {
                        wp_enqueue_script(
                            $scriptName,
                            $assetData['url'],
                            ['jquery'],
                            $assetData['version'] . '-' . $sourceId,
                            true
                        );
                    }
                }
            }
            unset($asset);
        }
    }

    /**
     * @param $asset
     *
     * @return array
     * @throws \VisualComposer\Framework\Illuminate\Container\BindingResolutionException
     */
    protected function getAssetData($asset)
    {
        $assetsSharedHelper = vchelper('AssetsShared');
        $assetsHelper = vchelper('Assets');
        $optionsHelper = vchelper('Options');
        $assetsVersion = $optionsHelper->get('hubAction:assets', '0');

        if (strpos($asset, 'assetsLibrary') !== false) {
            $url = $assetsSharedHelper->getPluginsAssetUrl($asset);
            $version = VCV_VERSION;
        } else {
            $url = $assetsHelper->getAssetUrl($asset);
            $version = $assetsVersion;
        }
        // Remove Version From URL
        $url = preg_replace('/(\?)ver=[^&]*(?:&|$)|&ver=[^&]*|(\?)v=[^&]*(?:&|$)|&v=[^&]*/', '', $url);
        $asset = preg_replace('/(\?)ver=[^&]*(?:&|$)|&ver=[^&]*|(\?)v=[^&]*(?:&|$)|&v=[^&]*/', '', $asset);

        $response = [
            'url' => $url,
            'version' => $version,
            'asset' => $asset,
        ];

        return $response;
    }

    /**
     * @param $sourceId
     *
     * @return void
     * @throws \VisualComposer\Framework\Illuminate\Container\BindingResolutionException
     */
    public function enqueuePageSettingsCss($sourceId)
    {
        if (!empty($this->doneList[ $sourceId ])) {
            return;
        }

        $previewHelper = vchelper('Preview');
        $previewId = $previewHelper->getPreviewId($sourceId);
        if ($previewId) {
            $sourceId = $previewId;
        }

        $styles = get_post_meta(
            $sourceId,
            '_' . VCV_PREFIX . 'pageDesignOptionsCompiledCss',
            true
        );
        if (!empty($styles)) {
            // Output inline via native API
            wp_register_style('vcv:assets:pageDesignOptions:' . $sourceId, false);
            wp_enqueue_style('vcv:assets:pageDesignOptions:' . $sourceId);
            wp_add_inline_style('vcv:assets:pageDesignOptions:' . $sourceId, vcfilter('vcv:assets:enqueuePageSettingsCss:styles', $styles, ['sourceId' => $sourceId]));
        }
        $this->doneList[ $sourceId ] = true;
    }
}
