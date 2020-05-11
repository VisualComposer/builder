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
    /**
     * Returns an array that includes current page/post template ids
     *
     * @param $sourceId
     *
     * @return array
     */
    public function getTemplateIds($sourceId)
    {
        $idList = [];

        $headerId = get_post_meta(
            $sourceId,
            '_' . VCV_PREFIX . 'HeaderTemplateId',
            true
        );
        $footerId = get_post_meta(
            $sourceId,
            '_' . VCV_PREFIX . 'FooterTemplateId',
            true
        );

        if (isset($headerId) && $headerId === 'default') {
            $headerId = $this->getTemplatePartId('header');
        }
        if (isset($footerId) && $footerId === 'default') {
            $footerId = $this->getTemplatePartId('footer');
        }

        if ($headerId) {
            $idList[] = $headerId;
        }
        if ($footerId) {
            $idList[] = $footerId;
        }
        $idList[] = $sourceId;

        return $idList;
    }

    /**
     * @param $templatePart
     *
     * @return bool|mixed
     */
    public function getTemplatePartId($templatePart)
    {
        $optionsHelper = vchelper('Options');

        $headerFooterSettings = $optionsHelper->get('headerFooterSettings');
        if ($headerFooterSettings === 'allSite') {
            return intval($this->allContent($templatePart));
        } elseif ($headerFooterSettings === 'customPostType') {
            $customTemplatePart = vcfilter(
                'vcv:themeEditor:layoutController:getTemplatePartId',
                ['pageFound' => false, 'replaceTemplate' => true, 'sourceId' => false],
                ['templatePart' => $templatePart]
            );
            if ($customTemplatePart && $customTemplatePart['replaceTemplate'] && $customTemplatePart['pageFound']) {
                return intval($customTemplatePart['sourceId']);
            }
        }
    }

    /**
     * @param $templatePart
     *
     * @return integer|bool
     */
    public function allContent($templatePart)
    {
        $optionsHelper = vchelper('Options');
        $templatePartId = $optionsHelper->get('headerFooterSettingsAll' . ucfirst($templatePart));

        if ($templatePart) {
            return $templatePartId;
        }

        return false;
    }

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

        $uploadDir = wp_upload_dir();
        $url = set_url_scheme(
            $uploadDir['baseurl'] . '/' . VCV_PLUGIN_ASSETS_DIRNAME . '/' . ltrim($filePath, '/\\')
        );

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
        $bundleUrl = '/assets-bundles/' . $concatenatedFilename;

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

        return $bundleUrl;
    }
}
