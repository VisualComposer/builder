<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Application;
use VisualComposer\Framework\Illuminate\Support\Helper;
use VisualComposer\Framework\Container;

class Assets extends Container implements Helper
{
    public function getFilePath($filename = '')
    {
        $destinationDir = VCV_PLUGIN_ASSETS_DIR_PATH . '/assets-bundles/';
        vchelper('File')->checkDir($destinationDir);
        $path = $destinationDir . ltrim($filename, '/\\');

        return $path;
    }

    public function getFileUrl($filename = '')
    {
        $url = content_url() . '/' . VCV_PLUGIN_ASSETS_DIRNAME . '/assets-bundles/' . ltrim($filename, '/\\');

        return $url;
    }

    /**
     * Create file with content in filesystem
     *
     * @param $content
     * @param $extension
     *
     * @return bool|string
     */
    public function updateBundleFile($content, $extension)
    {
        $fileHelper = vchelper('File');
        $content = $content ? $content : '';
        $concatenatedFilename = $extension;
        $bundle = $this->getFilePath($concatenatedFilename);
        $bundleUrl = $this->getFileUrl($concatenatedFilename);
        if (!$fileHelper->setContents($bundle, $content)) {
            return false;
        }

        return $bundleUrl;
    }

    /**
     * Remove all files by extension in asset-bundles directory.
     *
     * @param string $extension
     *
     * @return array
     */
    public function deleteAssetsBundles($extension = '')
    {
        $files = [];
        if (!empty($extension)) {
            $assetsHelper = vchelper('Assets');
            $destinationDir = $assetsHelper->getFilePath();

            // BC remove stale
            $extensionFull = $extensionFull = '.' . $extension;
            /** @var Application $app */
            $app = vcapp();
            $files = $app->rglob($destinationDir . '/*' . $extensionFull);
            if (is_array($files)) {
                foreach ($files as $file) {
                    unlink($file);
                }
                unset($file);
            }

            // BC remove exact file
            $files = $app->rglob($destinationDir . '/' . $extension);
            if (is_array($files)) {
                foreach ($files as $file) {
                    unlink($file);
                }
                unset($file);
            }
        }

        return $files;
    }
}
