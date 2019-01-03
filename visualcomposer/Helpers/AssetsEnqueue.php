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
        $assetsHelper = vchelper('Assets');
        $optionsHelper = vchelper('Options');
        $strHelper = vchelper('Str');
        $assetsVersion = $optionsHelper->get('hubAction:assets', '0');

        $assetsFiles = get_post_meta($sourceId, 'vcvSourceAssetsFiles', true);

        if (!is_array($assetsFiles)) {
            return;
        }

        if (isset($assetsFiles['cssBundles']) && is_array($assetsFiles['cssBundles'])) {
            foreach ($assetsFiles['cssBundles'] as $asset) {
                $asset = $assetsSharedHelper->findLocalAssetsPath($asset);
                foreach ((array)$asset as $single) {
                    if (strpos($single, 'assetsLibrary') !== false) {
                        $url = $assetsSharedHelper->getPluginsAssetUrl($single);
                        $version = VCV_VERSION;
                    } else {
                        $url = $assetsHelper->getAssetUrl($single);
                        $version = $assetsVersion;
                    }

                    wp_enqueue_style(
                        'vcv:assets:source:styles:' . $strHelper->slugify($single),
                        $url,
                        [],
                        $version
                    );
                }
            }
            unset($asset);
        }

        if (isset($assetsFiles['jsBundles']) && is_array($assetsFiles['jsBundles'])) {
            foreach ($assetsFiles['jsBundles'] as $asset) {
                $asset = $assetsSharedHelper->findLocalAssetsPath($asset);
                foreach ((array)$asset as $single) {
                    if (strpos($single, 'assetsLibrary') !== false) {
                        $url = $assetsSharedHelper->getPluginsAssetUrl($single);
                        $version = VCV_VERSION;
                    } else {
                        $url = $assetsHelper->getAssetUrl($single);
                        $version = $assetsVersion;
                    }

                    wp_enqueue_script(
                        'vcv:assets:source:scripts:' . $strHelper->slugify($single),
                        $url,
                        ['jquery'],
                        $version,
                        true
                    );
                }
            }
            unset($asset);
        }
    }
}
