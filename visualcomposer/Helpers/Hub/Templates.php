<?php

namespace VisualComposer\Helpers\Hub;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;
use WP_Query;

class Templates implements Helper
{
    public function getTemplatesPath($path = '')
    {
        $bundleFolder = VCV_PLUGIN_ASSETS_DIR_PATH . '/templates';

        $bundleFolder = apply_filters('vcv:helpers:hub:templates:getTemplatesPath', $bundleFolder);

        if ($path) {
            $bundleFolder .= '/' . ltrim($path, '\//');
        }

        return $bundleFolder;
    }

    public function getTemplatesUrl($path = '')
    {
        $assetsHelper = vchelper('Assets');

        $bundleFolder = $assetsHelper->getAssetUrl('/templates');

        $bundleFolder = apply_filters('vcv:helpers:hub:templates:getTemplatesUrl', $bundleFolder);

        if ($path) {
            $bundleFolder .= '/' . ltrim($path, '\//');
        }

        return $bundleFolder;
    }

    /**
     * Read all templates bundles.
     *
     * @param array $bundles
     *
     * @return array
     */
    public function readBundles($bundlePathList)
    {
        $templates = [];
        $fileHelper = vchelper('File');

        foreach ($bundlePathList as $bundlePath) {
            $bundle = json_decode($fileHelper->getContents($bundlePath), true);
            $dirname = dirname($bundlePath);
            $tag = basename($dirname);

            $templates[ $tag ] = $bundle;
        }

        return $templates;
    }

    /**
     * Get template by id.
     *
     * @param string $templateId
     * @param string $postType
     *
     * @return WP_Query
     */
    public function getTemplateById($templateId, $postType)
    {
        $savedTemplates = new WP_Query(
            [
                'post_type' => $postType,
                'post_status' => ['publish', 'pending', 'draft', 'auto-draft', 'future', 'private', 'trash'],
                'meta_query' => [
                    [
                        'key' => '_' . VCV_PREFIX . 'id',
                        'value' => $templateId,
                        'compare' => '=',
                    ],
                    [
                        'key' => '_' . VCV_PREFIX . 'type',
                        'value' => 'custom',
                        'compare' => '!=',
                    ],
                ],
            ]
        );

        return $savedTemplates;
    }

    /**
     * Insert new template or update existing one.
     *
     * @param array $template
     * @param string $templatePostType
     * @param string $name
     *
     * @return false|int|\WP_Error
     */
    public function insertNewTemplate($templateId, $templatePostType, $name)
    {
        $savedTemplates = $this->getTemplateById($templateId, $templatePostType);

        if (!$savedTemplates->have_posts()) {
            $postId = wp_insert_post(
                [
                    'post_title' => $name,
                    'post_type' => $templatePostType,
                    'post_status' => 'publish',
                ]
            );
        } else {
            $savedTemplates->the_post();
            $postId = get_the_ID();
            wp_reset_postdata();
            wp_update_post(
                [
                    'ID' => $postId,
                    'post_title' => $name,
                    'post_type' => $templatePostType,
                    'post_status' => 'publish',
                ]
            );
        }

        return $postId;
    }

    /**
     * Update post metas for template
     *
     * @param int $templateId
     * @param array $template
     * @param string $type
     * @param string $actionName
     * @param $templateElements
     * @param string $postType
     */
    public function updateTemplateMetas($templateId, $template, $type, $actionName, $templateElements, $postType)
    {
        update_post_meta($templateId, '_' . VCV_PREFIX . 'description', $template['description']);
        update_post_meta($templateId, '_' . VCV_PREFIX . 'type', $type);
        update_post_meta($templateId, '_' . VCV_PREFIX . 'thumbnail', $template['thumbnail']);
        update_post_meta($templateId, '_' . VCV_PREFIX . 'preview', $template['preview']);
        update_post_meta($templateId, '_' . VCV_PREFIX . 'id', $template['id']);
        update_post_meta($templateId, '_' . VCV_PREFIX . 'bundle', $actionName);
        update_post_meta($templateId, 'vcvEditorTemplateElements', $templateElements);

        if ($postType === 'vcv_tutorials') {
            if (isset($template['postMeta']['vcvSourceCss'][0])) {
                update_post_meta(
                    $templateId,
                    'vcvSourceCss',
                    $template['postMeta']['vcvSourceCss'][0]
                );
            }

            if (isset($template['postMeta']['vcvSettingsSourceCustomCss'][0])) {
                update_post_meta(
                    $templateId,
                    'vcvSettingsSourceCustomCss',
                    $template['postMeta']['vcvSettingsSourceCustomCss'][0]
                );
            }
        }
    }

    /**
     * @param $template
     *
     * @return mixed
     */
    public function processTemplateMetaImages($template)
    {
        $wpMediaHelper = vchelper('WpMedia');
        $urlHelper = vchelper('Url');
        if ($wpMediaHelper->checkIsImage($template['preview'])) {
            $url = $template['preview'];
            if (!$urlHelper->isUrl($url) && strpos($url, '[publicPath]') === false) {
                $url = '[publicPath]' . $url;
            }

            $preview = $this->processSimple($url, $template);
            if ($preview) {
                $template['preview'] = $preview;
            }
        }

        if ($wpMediaHelper->checkIsImage($template['thumbnail'])) {
            $url = $template['thumbnail'];
            if (!$urlHelper->isUrl($url) && strpos($url, '[publicPath]') === false) {
                $url = '[publicPath]' . $url;
            }

            $thumbnail = $this->processSimple($url, $template);
            if ($thumbnail) {
                $template['thumbnail'] = $thumbnail;
            }
        }

        return $template;
    }

    /**
     * @param $url
     * @param $template
     * @param string $prefix
     *
     * @return bool|mixed|string
     */
    public function processSimple($url, $template, $prefix = '')
    {
        $fileHelper = vchelper('File');
        $hubTemplatesHelper = vchelper('HubTemplates');
        $urlHelper = vchelper('Url');

        if ($urlHelper->isUrl($url)) {
            $imageFile = $fileHelper->download($url);
            $localImagePath = strtolower($prefix . '' . basename($url));
            if (!vcIsBadResponse($imageFile)) {
                $templatePath = $hubTemplatesHelper->getTemplatesPath($template['id']);
                $fileHelper->createDirectory(
                    $templatePath
                );
                if (!$fileHelper->exists($templatePath)) {
                    return false;
                }

                if ($fileHelper->rename($imageFile, $templatePath . '/' . $localImagePath)) {
                    return $hubTemplatesHelper->getTemplatesUrl($template['id'] . '/' . $localImagePath);
                }
            } else {
                return false;
            }
        } else {
            // File located locally
            if (strpos($url, '[publicPath]') !== false) {
                $url = str_replace('[publicPath]', '', $url);

                return $hubTemplatesHelper->getTemplatesUrl($template['id'] . '/' . ltrim($url, '\\/'));
            }

            if (strpos($url, 'assets/elements/') !== false) {
                return $hubTemplatesHelper->getTemplatesUrl($template['id'] . '/' . ltrim($url, '\\/'));
            }

            return $url; // it is local file url (default file)
        }

        return false;
    }

    /**
     * Replace template elements placeholder path with real path.
     *
     * @param array $templateElements
     * @param string $path
     *
     * @return array
     */
    public function replaceTemplateElementPathPlaceholder($templateElements, $folder)
    {
        $templateElements = json_decode(
            str_replace(
                '[publicPath]',
                $this->getTemplatesUrl($folder),
                wp_json_encode($templateElements)
            ),
            true
        );

        return $templateElements;
    }

    /**
     * @param array $templateElements
     *
     * @return array
     */
    public function isMenuExist($templateElements)
    {
        foreach ($templateElements as $element) {
            if (isset($element['menuSource']) && !empty($element['menuSource'])) {
                $menusFromKey = get_terms(
                    [
                        'taxonomy' => 'nav_menu',
                        'slug' => $element['menuSource'],
                    ]
                );
                if (empty($menusFromKey)) {
                    $templateElements[ $element['id'] ]['menuSource'] = '';
                }
            }
        }

        return $templateElements;
    }
}
