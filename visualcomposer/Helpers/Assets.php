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

    public function getAssetUrl($filePath = '')
    {
        if (preg_match('/^http/', $filePath)) {
            return set_url_scheme($filePath);
        }
        if (strpos($filePath, VCV_PLUGIN_URL) !== false) {
            return $filePath;
        }
        $uploadDir = wp_upload_dir();
        $url = $uploadDir['baseurl'];
        if (strpos($filePath, $url) !== false) {
            return $filePath;
        }

        if (vcvenv('VCV_TF_ASSETS_IN_UPLOADS')) {
            $uploadDir = wp_upload_dir();
            $url = set_url_scheme(
                $uploadDir['baseurl'] . '/' . VCV_PLUGIN_ASSETS_DIRNAME . '/' . ltrim($filePath, '/\\')
            );
        } else {
            $url = content_url() . '/' . VCV_PLUGIN_ASSETS_DIRNAME . '/' . ltrim($filePath, '/\\');
        }

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
        if (vcvenv('VCV_TF_ASSETS_IN_UPLOADS')) {
            $bundleUrl = '/assets-bundles/' . $concatenatedFilename;
        } else {
            $bundleUrl = $this->getAssetUrl('/assets-bundles/' . $concatenatedFilename);
        }
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
            $files = $app->glob(rtrim($destinationDir, '/\\') . '/*' . $extensionFull);
            if (is_array($files)) {
                foreach ($files as $file) {
                    unlink($file);
                }
                unset($file);
            }

            // BC remove exact file
            $files = $app->glob(rtrim($destinationDir, '/\\') . '/' . $extension);
            if (is_array($files)) {
                foreach ($files as $file) {
                    unlink($file);
                }
                unset($file);
            }
        }

        return $files;
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

        if (vcvenv('VCV_TF_ASSETS_IN_UPLOADS')) {
            if (preg_match('/' . VCV_PLUGIN_ASSETS_DIRNAME . '/', $path)) {
                $url = $this->getAssetUrl();
                $url = str_replace(['http://', 'https://'], '', $url);
                $contentUrl = content_url() . '/' . VCV_PLUGIN_ASSETS_DIRNAME . '/';
                $contentUrl = str_replace(['http://', 'https://'], '', $contentUrl);
                $path = str_replace(['http://', 'https://'], '', $path);

                if (strpos($path, $url) !== false) {
                    $bundleUrl = str_replace($url, '', $path);
                } elseif (strpos($path, $contentUrl) !== false) {
                    $bundleUrl = str_replace($contentUrl, '', $path);
                }
            }
        }

        return $bundleUrl;
    }
}
