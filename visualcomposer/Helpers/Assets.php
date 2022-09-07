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
use WP_Query;

class Assets extends Container implements Helper
{
    /**
     * Returns an array that includes current page/post template ids
     *
     * @param $sourceId
     *
     * @return array
     * @throws \VisualComposer\Framework\Illuminate\Container\BindingResolutionException
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

        if (empty($headerId) || $headerId === 'default') {
            $headerId = $this->getTemplatePartId('header');
        }
        if (empty($headerId) || $footerId === 'default') {
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
     * Get id of template part.
     *
     * @param $templatePart
     *
     * @return int|void
     * @throws \VisualComposer\Framework\Illuminate\Container\BindingResolutionException
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

    /**
     * @param $filename
     *
     * @return string
     */
    public function getFilePath($filename = '')
    {
        $destinationDir = VCV_PLUGIN_ASSETS_DIR_PATH . '/assets-bundles/';
        vchelper('File')->checkDir($destinationDir);
        $path = $destinationDir . ltrim($filename, '/\\');

        return $path;
    }

    /**
     * @param $filePath
     *
     * @return string
     */
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
     * @throws \VisualComposer\Framework\Illuminate\Container\BindingResolutionException
     */
    public function deleteAssetsBundles($extension = '')
    {
        $files = [];
        if (!empty($extension)) {
            $assetsHelper = vchelper('Assets');
            $fileHelper = vchelper('File');
            $destinationDir = $assetsHelper->getFilePath();

            // BC remove stale
            $extensionFull = '.' . $extension;
            /** @var Application $app */
            $app = vcapp();
            $files = $app->glob(rtrim($destinationDir, '/\\') . '/*' . $extensionFull);
            if (is_array($files)) {
                foreach ($files as $file) {
                    $fileHelper->removeFile($file);
                }
                unset($file);
            }

            // BC remove exact file
            $files = $app->glob(rtrim($destinationDir, '/\\') . '/' . $extension);
            if (is_array($files)) {
                foreach ($files as $file) {
                    $fileHelper->removeFile($file);
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
     * @return array|string|string[]
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

    /**
     * Generate (save to fs and update db) post styles bundle.
     *
     * @param $response
     * @param $payload
     *
     * @return bool|string URL to generated bundle.
     * @throws \VisualComposer\Framework\Illuminate\Container\BindingResolutionException
     */
    public function generateSourceCssFile($response, $payload)
    {
        $assetsHelper = vchelper('Assets');
        $fileHelper = vchelper('File');
        $globalElementsBaseCss = [];
        $globalElementsMixinsCss = [];
        $sourceId = $payload['sourceId'];
        $sourceCss = get_post_meta($sourceId, 'vcvSourceCss', true);
        $globalElementsCssData = get_post_meta($sourceId, VCV_PREFIX . 'globalElementsCssData', true);

        $globalElementsAttributesCss = [];
        if (is_array($globalElementsCssData)) {
            foreach ($globalElementsCssData as $element) {
                if (!$element) {
                    continue;
                }

                $baseCssHash = wp_hash($element['baseCss']);
                $mixinsCssHash = wp_hash($element['mixinsCss']);
                $attributesCssHash = wp_hash($element['attributesCss']);
                $globalElementsBaseCss[ $baseCssHash ] = $element['baseCss'];
                $globalElementsMixinsCss[ $mixinsCssHash ] = $element['mixinsCss'];
                $globalElementsAttributesCss[ $attributesCssHash ] = $element['attributesCss'];
            }
        }

        $globalElementsAttributesCssContent = join('', array_values($globalElementsAttributesCss));
        $globalElementsBaseCssContent = join('', array_values($globalElementsBaseCss));
        $globalElementsMixinsCssContent = join('', array_values($globalElementsMixinsCss));
        $sourceCssContent = $globalElementsBaseCssContent . $globalElementsMixinsCssContent
            . $globalElementsAttributesCssContent . $sourceCss;

        $sourceChecksum = wp_hash($sourceCssContent);
        $oldSourceChecksum = get_post_meta($sourceId, '_' . VCV_PREFIX . 'sourceChecksum', true);

        $sourceCssName = $sourceChecksum . '.source.css';

        $bundleUrl = $assetsHelper->updateBundleFile(
            $sourceCssContent,
            $sourceCssName
        );

        if ($sourceChecksum !== $oldSourceChecksum) {
            $sourcePath = $assetsHelper->getFilePath($sourceCssName);
            if ($fileHelper->isFile($sourcePath)) {
                $this->deleteSourceAssetsFile($sourceId);
                update_post_meta($sourceId, '_' . VCV_PREFIX . 'sourceChecksum', $sourceChecksum);
                update_post_meta($sourceId, 'vcvSourceCssFileUrl', $bundleUrl);
                update_post_meta($sourceId, '_' . VCV_PREFIX . 'globalCssMigrated', 1);
            }
        }

        $response['sourceBundleCssFileUrl'] = $bundleUrl;

        return $response;
    }

    /**
     * Delete post styles bundle.
     *
     * @param int $sourceId
     *
     * @return bool
     * @throws \VisualComposer\Framework\Illuminate\Container\BindingResolutionException
     */
    public function deleteSourceAssetsFile($sourceId)
    {
        $assetsHelper = vchelper('Assets');
        $extension = $sourceId . '.source.css';
        $assetsHelper->deleteAssetsBundles($extension);

        $sourceChecksum = get_post_meta($sourceId, '_' . VCV_PREFIX . 'sourceChecksum', true);
        $checksumArgs = [
            'meta_key' => '_' . VCV_PREFIX . 'sourceChecksum',
            'meta_value' => $sourceChecksum,
            'post_type' => 'any',
            'post_status' => 'any',
        ];
        $checksumQuery = new WP_Query($checksumArgs);
        //@codingStandardsIgnoreLine
        $postCount = $checksumQuery->post_count;
        if ($postCount === 1) { // Do not remove if this post is not match with deleting id
            $post = $checksumQuery->post; // Fetch the post that is using that checksum
            $postID = $post->ID;
            if ($postID !== $sourceId) {
                return true;
            } else {
                $extension = $sourceChecksum . '.source.css';
                $assetsHelper->deleteAssetsBundles($extension);
            }
        } elseif ($postCount < 1) {
            $extension = $sourceChecksum . '.source.css';
            $assetsHelper->deleteAssetsBundles($extension);
        }

        return true;
    }

    /**
     * Replace assets url placeholder with real url.
     * We use placeholder in post content to differentiate VC assets.
     *
     * @param string $content
     * @param string $assetUrl
     * @param string $prefix we use it to differentiate some special cases placeholders
     *
     * @return array|string|string[]
     */
    public function replaceAssetsUrl($content, $assetUrl, $prefix = '')
    {
        if ($prefix) {
            $prefix .= '-';
        }

        return str_replace(
            [
                '[' . $prefix . 'vcvAssetsUploadUrl]',
                'http://|!|' . $prefix . 'vcvAssetsUploadUrl|!|',
                'https://|!|' . $prefix . 'vcvAssetsUploadUrl|!|',
                '|!|' . $prefix . 'vcvAssetsUploadUrl|!|',
            ],
            $assetUrl,
            $content
        );
    }

    /**
     * Replace uploads url placeholder with real url.
     * We use placeholder in post content to differentiate VC uploads.
     *
     * @param string $content
     * @param string $uploadUrl
     * @param string $prefix we use it to differentiate some special cases placeholders
     *
     * @return array|string|string[]
     */
    public function replaceUploadsUrl($content, $uploadUrl, $prefix = '')
    {
        if ($prefix) {
            $prefix .= '-';
        }

        return str_replace(
            [
                '[' . $prefix . 'vcvUploadUrl]',
                'http://|!|' . $prefix . 'vcvUploadUrl|!|',
                'https://|!|' . $prefix . 'vcvUploadUrl|!|',
                '|!|' . $prefix . 'vcvUploadUrl|!|',
            ],
            $uploadUrl,
            $content
        );
    }
}
