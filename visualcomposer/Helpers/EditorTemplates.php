<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;

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
                'order' => 'asc',
            ];

        $templatesGroups = vchelper('PostType')->queryGroupByMetaKey(
            $args,
            '_' . VCV_PREFIX . 'type'
        );

        $outputTemplates = [];
        foreach ($templatesGroups as $groupKey => $templates) {
            $groupTemplates = [];
            foreach ($templates as $key => $template) {
                /** @var $template \WP_Post */
                $meta = get_post_meta($template->ID, VCV_PREFIX . 'pageContent', true);
                $templateElements = $this->getTemplateElements($meta, $template);
                $groupTemplates = $this->processTemplateElements($templateElements, $template, $groupTemplates);
            }
            if (!empty($groupTemplates)) {
                if (empty($groupKey)) {
                    $groupKey = 'custom';
                }
                $outputTemplates[ $groupKey ] = [
                    'name' => $this->getGroupName($groupKey),
                    'type' => $groupKey,
                    'templates' => $groupTemplates,
                ];
            }
        }

        return $outputTemplates;
    }

    public function getGroupName($key)
    {
        $name = '';
        switch ($key) {
            case '':
            case 'custom':
                $name = __('My Templates', 'vcwb');
                break;
            case 'hub':
                $name = __('Premium Templates', 'vcwb');
                break;
            case 'predefined':
                $name = __('Templates', 'vcwb');
                break;
        }

        return $name;
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
        return []; //
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

    /**
     * @param $templateElements
     * @param $template
     * @param $groupTemplates
     *
     * @return array
     */
    protected function processTemplateElements($templateElements, $template, $groupTemplates)
    {
        if (!empty($templateElements)) {
            $type = get_post_meta($template->ID, '_' . VCV_PREFIX . 'type', true);
            $thumbnail = get_post_meta($template->ID, '_' . VCV_PREFIX . 'thumbnail', true);
            $preview = get_post_meta($template->ID, '_' . VCV_PREFIX . 'preview', true);
            $bundle = get_post_meta($template->ID, '_' . VCV_PREFIX . 'bundle', true);
            $description = get_post_meta($template->ID, '_' . VCV_PREFIX . 'description', true);

            $data = [
                // @codingStandardsIgnoreLine
                'name' => $template->post_title,
                'data' => $templateElements,
                'bundle' => $bundle,
                'id' => (string)$template->ID,
            ];
            if (!empty($thumbnail)) {
                $data['thumbnail'] = $thumbnail;
            }
            if (!empty($preview)) {
                $data['preview'] = $preview;
            }
            if (!empty($type)) {
                $data['type'] = $type;
            }
            if (!empty($description)) {
                $data['description'] = $description;
            }
            $groupTemplates[] = $data;
        }

        return $groupTemplates;
    }

    /**
     * @param $meta
     * @param $template
     *
     * @return array|mixed
     */
    protected function getTemplateElements($meta, $template)
    {
        $templateElements = [];
        if (!empty($meta)) {
            $decoded = json_decode(rawurldecode($meta), true);
            if ($decoded && isset($decoded['elements'])) {
                $templateElements = $decoded['elements'];
            }
        } else {
            $templateElements = get_post_meta($template->ID, 'vcvEditorTemplateElements', true);
        }

        return $templateElements;
    }
}
