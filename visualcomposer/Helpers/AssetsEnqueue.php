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

                    wp_enqueue_style(
                        'vcv:assets:source:styles:' . $strHelper->slugify($single),
                        $assetData['url'],
                        [],
                        $assetData['version']
                    );
                }
            }
            unset($asset);
        }

        if (isset($assetsFiles['jsBundles']) && is_array($assetsFiles['jsBundles'])) {
            foreach ($assetsFiles['jsBundles'] as $asset) {
                $asset = $assetsSharedHelper->findLocalAssetsPath($asset);
                foreach ((array)$asset as $single) {
                    $assetData = $this->getAssetData($single);

                    // Remove Version and GET Parameters From URL
                    $url = strtok($assetData['url'], '?');
                    $single = strtok($single, '?');

                    $scriptName = 'vcv:assets:source:scripts:' . $strHelper->slugify($single);
                    if (!wp_script_is($scriptName, 'enqueued')) {
                        wp_enqueue_script(
                            $scriptName,
                            $url,
                            ['jquery'],
                            $assetData['version'],
                            true
                        );
                    }
                }
            }
            unset($asset);
        }
    }

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

        $response = array(
            'url' => $url,
            'version' => $version
        );
        return $response;
    }
}
