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

//        $bundleFolder = apply_filters('vcv:helpers:hub:getTemplatePath', $bundleFolder);

        if ($path) {
            $bundleFolder .= '/' . ltrim($path, '\//');
        }

        return $bundleFolder;
    }

    public function getTemplatesUrl($path = '')
    {
        $assetsHelper = vchelper('Assets');

        $bundleFolder = $assetsHelper->getAssetUrl('/templates');

//        $bundleFolder = apply_filters('vcv:helpers:hub:getTemplateUrl', $bundleFolder);

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

        foreach ($bundlePathList as $bundlePath) {
            $bundle = json_decode(file_get_contents($bundlePath), true);
            $dirname = dirname($bundlePath);
            $tag = basename($dirname);

            $templates[$tag] = $bundle;
        }

        return $templates;
    }

    public function activateTemplates($templateList)
    {
        $templatesHelper = vchelper('HubTemplates');
        foreach ($templateList as $templateId => $templateData) {
            $postId = $templatesHelper->insertNewTemplate(
                $templateData,
                'vcv_templates',
                $templateData['post']['post_title']
            );

            $templatesHelper->updateTemplateMetas(
                $postId,
                $templateData,
                'predefined',
                'predefinedTemplate/photographyPortfolio',
                $templateData['data'],
                'vcv_templates'
            );
        }
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
    public function insertNewTemplate($template, $templatePostType, $name)
    {
        $savedTemplates = $this->getTemplateById($template['id'], $templatePostType);

        if (!$savedTemplates->have_posts()) {
            $templateId = wp_insert_post(
                [
                    'post_title' => $name,
                    'post_type' => $templatePostType,
                    'post_status' => 'publish',
                ]
            );
        } else {
            $savedTemplates->the_post();
            $templateId = get_the_ID();
            wp_reset_postdata();
            wp_update_post(
                [
                    'ID' => $templateId,
                    'post_title' => $name,
                    'post_type' => $templatePostType,
                    'post_status' => 'publish',
                ]
            );
        }

        return $templateId;
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
}
