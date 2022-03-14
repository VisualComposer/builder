<?php

namespace VisualComposer\Modules\Import;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Assets;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Controller responsible for injections to native wp import.
 */
class ImportController extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    public function __construct()
    {
        $this->wpAddAction(
            'import_post_meta',
            'importPostMetaController',
            100,
            2
        );

        $this->wpAddFilter(
            'wp_import_post_data_processed',
            'replaceAssetsUrlPlaceholderToImportPlaceholder',
            10,
            2
        );

        $this->addFilter(
            'vcv:frontView:replaceUrl:content',
            'replaceAssetsUrlWpPlaceholder'
        );
    }

    /**
     * We need additional action while importing post.
     *
     * @param int $postId
     * @param string $metaKey
     * @param \VisualComposer\Helpers\Assets $assetsHelper
     *
     * @return void
     * @throws \ReflectionException
     * @throws \VisualComposer\Framework\Illuminate\Container\BindingResolutionException
     */
    protected function importPostMetaController($postId, $metaKey, Assets $assetsHelper)
    {
        //@codingStandardsIgnoreLine
        global $wp_import;
        if ($metaKey == VCV_PREFIX . 'globalElementsCssData') {
            $assetsHelper->generateSourceCssFile([], ['sourceId' => $postId]);
        }
        //@codingStandardsIgnoreLine
        if (!empty($wp_import->base_url)) {
            //@codingStandardsIgnoreLine
            update_post_meta($postId, '_' . VCV_PREFIX . 'wpImportBaseUrl', $wp_import->base_url);
        }
    }

    /**
     * Change assets url vcv placeholder with import url vcv placeholder.
     *
     * @param array $postData
     *
     * @return array
     */
    protected function replaceAssetsUrlPlaceholderToImportPlaceholder($postData)
    {
        $placeholderList = [
            '[vcvAssetsUploadUrl]' => '[wp-import-vcvAssetsUploadUrl]',
            'http://|!|vcvAssetsUploadUrl|!|' => 'http://|!|wp-import-vcvAssetsUploadUrl|!|',
            'https://|!|vcvAssetsUploadUrl|!|' => 'https://|!|wp-import-vcvAssetsUploadUrl|!|',
            '|!|vcvAssetsUploadUrl|!|' => '|!|wp-import-vcvAssetsUploadUrl|!|',
            '[vcvUploadUrl]' => '[wp-import-vcvUploadUrl]',
            'http://|!|vcvUploadUrl|!|' => 'http://|!|wp-import-vcvUploadUrl|!|',
            'https://|!|vcvUploadUrl|!|' => 'https://|!|wp-import-vcvUploadUrl|!|',
            '|!|vcvUploadUrl|!|' => '|!|wp-import-vcvUploadUrl|!|',
        ];

        $content = $postData['post_content'];
        foreach ($placeholderList as $vcvPlaceholder => $importPlaceholder) {
            $content = str_replace($vcvPlaceholder, $importPlaceholder, $content);
        }

        $postData['post_content'] = $content;

        return $postData;
    }

    /**
     * Replace assets url wp import placeholder with wp import base url.
     * Note: we need use additional placeholder for our assets
     * to separate wp native imported assets and assets that user add after import
     *
     * @param string $content
     *
     * @return string
     */
    protected function replaceAssetsUrlWpPlaceholder($content, Assets $assetsHelper)
    {
        global $post;

        if (empty($post->ID)) {
            return $content;
        }

        $wpImportBaseUrl = get_post_meta($post->ID, '_' . VCV_PREFIX . 'wpImportBaseUrl', true);
        if (empty($wpImportBaseUrl)) {
            return $content;
        }

        $assetUrl = $this->changeAssetsUrlToImportBase($assetsHelper->getAssetUrl());
        $uploadDir = wp_upload_dir();
        $uploadUrl = $this->changeBaseUploadDirToImportBase(set_url_scheme($uploadDir['baseurl']));

        $content = $assetsHelper->replaceAssetsUrl($content, $assetUrl, 'wp-import');
        $content = $assetsHelper->replaceUploadsUrl($content, $uploadUrl, 'wp-import');

        return $content;
    }

    /**1
     * Replace assets url with import base url.
     *
     * @param $assetUrl
     *
     * @return string
     */
    protected function changeAssetsUrlToImportBase($assetUrl)
    {
        global $post;

        if (empty($post->ID)) {
            return $assetUrl;
        }

        $wpImportBaseUrl = get_post_meta($post->ID, '_' . VCV_PREFIX . 'wpImportBaseUrl', true);
        if (empty($wpImportBaseUrl)) {
            return $assetUrl;
        }

        $siteUrl = get_site_url();

        $uploadDir = wp_upload_dir();
        $wpImportBaseUrl = str_replace($siteUrl, $wpImportBaseUrl, $uploadDir['baseurl']);

        return $wpImportBaseUrl . '/' . VCV_PLUGIN_ASSETS_DIRNAME . '/';
    }

    /**
     * Replace upload dir url with import base url.
     *
     * @param string $uploadDir
     *
     * @return string
     */
    protected function changeBaseUploadDirToImportBase($uploadDir)
    {
        global $post;

        if (empty($post->ID)) {
            return $uploadDir;
        }

        $wpImportBaseUrl = get_post_meta($post->ID, '_' . VCV_PREFIX . 'wpImportBaseUrl', true);
        if (empty($wpImportBaseUrl)) {
            return $uploadDir;
        }

        $siteUrl = get_site_url();

        return str_replace($siteUrl, $wpImportBaseUrl, $uploadDir);
    }
}
