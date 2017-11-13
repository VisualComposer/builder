<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;
use WP_Query;

/**
 * Helper methods related to editor/templates.
 * Class EditorTemplates.
 */
class EditorTemplates implements Helper
{
    /**
     * @return array
     */
    public function all()
    {
        $args =
            [
                'posts_per_page' => '-1',
                'post_type' => 'vcv_templates',
                'meta_query' => [
                    'relation' => 'OR',
                    [
                        'key' => '_' . VCV_PREFIX . 'type',
                        'value' => '',
                        'compare' => 'NOT EXISTS',
                    ],
                    [
                        'key' => '_' . VCV_PREFIX . 'type',
                        'value' => 'custom',
                        'compare' => '=',
                    ],

                ],
            ];

        $templates = vchelper('PostType')->query($args);

        return $templates;
    }

    /**
     * @param bool $data
     *
     * @param bool $id
     *
     * @return array
     */
    public function allPredefined($data = true, $id = false)
    {
        $templates = [];
        $args =
            [
                'post_type' => 'vcv_templates',
                'posts_per_page' => '-1',
                'order' => 'ASC',
                'meta_query' => [
                    [
                        'key' => '_' . VCV_PREFIX . 'type',
                        'value' => 'predefined',
                        'compare' => '=',
                    ],
                ],
            ];

        $predefinedTemplates = vchelper('PostType')->query($args);

        if (is_array($predefinedTemplates)) {
            foreach ($predefinedTemplates as $predefinedTemplate) {
                //@codingStandardsIgnoreLine
                $template['name'] = $predefinedTemplate->post_title;
                $template['description'] = get_post_meta(
                    $predefinedTemplate->ID,
                    '_' . VCV_PREFIX . 'description',
                    true
                );
                $template['type'] = get_post_meta($predefinedTemplate->ID, '_' . VCV_PREFIX . 'type', true);
                $template['thumbnail'] = get_post_meta($predefinedTemplate->ID, '_' . VCV_PREFIX . 'thumbnail', true);
                $template['preview'] = get_post_meta($predefinedTemplate->ID, '_' . VCV_PREFIX . 'preview', true);
                $template['id'] = get_post_meta($predefinedTemplate->ID, '_' . VCV_PREFIX . 'id', true);

                if ($data) {
                    $template['data'] = get_post_meta($predefinedTemplate->ID, 'vcvEditorTemplateElements', true);
                }
                if ($id) {
                    $templateId = get_post_meta($predefinedTemplate->ID, 'id', true);
                    $templates[ $templateId ] = $template;
                } else {
                    $templates[] = $template;
                }
            }
        }

        return $templates;
    }

    /**
     * @param $templateId
     *
     * @return \WP_Post
     */
    public function get($templateId)
    {
        $template = vchelper('PostType')->get($templateId, 'vcv_templates');

        return $template;
    }
}
