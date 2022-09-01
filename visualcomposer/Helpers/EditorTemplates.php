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
     * Query to get all our global templates type with some additional meta info for them.
     *
     * @return array|object|\stdClass[]|null
     */
    public function queryTemplates()
    {
        global $wpdb;

        return $wpdb->get_results(
            "
                SELECT a.ID as `id`, a.post_title as `name`, b.meta_key, b.meta_value
                FROM {$wpdb->posts} as a
                LEFT JOIN {$wpdb->postmeta} as b on b.post_id = a.ID
                WHERE a.post_type = 'vcv_templates' and a.post_status in ('draft', 'publish')
                AND b.meta_key IN ('_vcv-type', '_vcv-thumbnail', '_vcv-preview', '_vcv-description', '_vcv-bundle')
                ORDER BY a.post_modified ASC",
            ARRAY_A
        );
    }

    /**
     * Query to get all our global templates with 'custom' type.
     *
     * @return array|object|\stdClass[]|null
     */
    public function queryCustomTemplates()
    {
        global $wpdb;

        return $wpdb->get_results(
            "
                SELECT a.ID as `id`, a.post_title as `name`, b.meta_key, b.meta_value
                FROM {$wpdb->posts} as a
                LEFT JOIN {$wpdb->postmeta} as b on b.post_id = a.ID
                WHERE a.post_type = 'vcv_templates' and a.post_status in ('draft', 'publish')
AND b.meta_key='_vcv-type' AND b.meta_value='custom'
 ORDER BY a.post_modified ASC",
            ARRAY_A
        );
    }

    /**
     * Get all global templates.
     *
     * @return array
     */
    public function all()
    {
        $cache = wp_cache_get('vcv:helpers:templates:all', 'vcwb');
        if (!empty($cache)) {
            return $cache;
        }

        $templates = $this->queryTemplates();
        $groupedResults = $this->groupQueryTemplates($templates);
        wp_cache_set('vcv:helpers:templates:all', $groupedResults, 'vcwb', 3600);

        return $groupedResults;
    }

    /**
     * Get global templates with type 'custom'.
     *
     * @return array
     */
    public function getCustomTemplates()
    {
        $cache = wp_cache_get('vcv:helpers:templates:all:custom', 'vcwb');
        if (!empty($cache)) {
            return $cache;
        }

        $templates = $this->queryCustomTemplates();
        $groupedResults = $this->groupQueryTemplates($templates);
        wp_cache_set('vcv:helpers:templates:all:custom', $groupedResults, 'vcwb', 3600);

        return $groupedResults;
    }

    public function getGroupName($key)
    {
        $name = '';
        switch ($key) {
            case 'customHeader':
                $name = __('My Headers Templates', 'visualcomposer');
                break;
            case '':
            case 'custom':
                $name = __('My Templates', 'visualcomposer');
                break;
            case 'customBlock':
                $name = __('My Blocks', 'visualcomposer');
                break;
            case 'hub':
            case 'predefined':
                $name = __('Hub Templates', 'visualcomposer');
                break;
            case 'customFooter':
                $name = __('My Footers Templates', 'visualcomposer');
                break;
        }

        $name = vcfilter('vcv:template:groupName', $name, ['key' => $key]);

        return $name;
    }

    public function isUserTemplateType($type)
    {
        $result = false;
        if ($type === '' || $type === 'popup' || strpos($type, 'custom') !== false) {
            $result = true;
        }
        $result = vcfilter('vcv:template:isUserTemplateType', $result, ['type' => $type]);

        return $result;
    }

    /**
     * @param $templateId
     *
     * @return \WP_Post
     */
    public function get($templateId)
    {
        $template = vchelper('PostType')->get($templateId, 'vcv_templates');
        if (vcvenv('VCV_FT_TEMPLATE_DATA_ASYNC')) {
            $meta = get_post_meta($template->ID, VCV_PREFIX . 'pageContent', true);
            $templateElements = $this->getTemplateElements($meta, $template);
            $template->vcvTemplateElements = $templateElements;
        }

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
        if (!empty($templateElements) || vcvenv('VCV_FT_TEMPLATE_DATA_ASYNC')) {
            $type = get_post_meta($template->ID, '_' . VCV_PREFIX . 'type', true);
            $thumbnail = get_post_meta($template->ID, '_' . VCV_PREFIX . 'thumbnail', true);
            $preview = get_post_meta($template->ID, '_' . VCV_PREFIX . 'preview', true);
            $bundle = get_post_meta($template->ID, '_' . VCV_PREFIX . 'bundle', true);
            $description = get_post_meta($template->ID, '_' . VCV_PREFIX . 'description', true);
            $optionsHelper = vchelper('Options');
            $usageCount = $optionsHelper->get('usageCount', []);

            $data = [
                // @codingStandardsIgnoreLine
                'name' => $template->post_title,
                'bundle' => $bundle,
                'id' => (string)$template->ID,
                'usageCount' => isset($usageCount[ 'template/' . $template->ID ]) ? $usageCount[ 'template/'
                . $template->ID ] : 0,
            ];
            if (!vcvenv('VCV_FT_TEMPLATE_DATA_ASYNC')) {
                $data['data'] = $templateElements;
            }
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
            $templateElements = $this->getTemplateElementsByMeta($template->ID);
        }

        return $templateElements;
    }

    /**
     * Get template elements from our meta.
     *
     * @param int $templateId
     *
     * @return array
     */
    public function getTemplateElementsByMeta($templateId)
    {
        $templateElements = get_post_meta($templateId, 'vcvEditorTemplateElements', true);
        $folder = get_post_meta($templateId, '_vcv-id', true);
        $hubTemplatesHelper = vchelper('HubTemplates');
        $templateElements = $hubTemplatesHelper->replaceTemplateElementPathPlaceholder($templateElements, $folder);

        return $templateElements;
    }

    /**
     * @return array
     */
    public function getCustomTemplateOptions()
    {
        $options = [];
        $options[] = [
            'label' => __('Select a template', 'visualcomposer'),
            'value' => '',
        ];

        $customTemplates = $this->getCustomTemplates();
        if (!empty($customTemplates)) {
            foreach ($customTemplates as $templates) {
                $options[] = [
                    'group' => [
                        'label' => $this->getGroupName($templates['type']),
                        'values' => array_map(
                            function ($template) {
                                return [
                                    'label' => $template['name'],
                                    'value' => (int)$template['id'],
                                ];
                            },
                            $templates['templates']
                        ),
                    ],
                ];
            }
        }

        return vcfilter('vcv:helpers:templates:getCustomTemplates', $options);
    }

    public function create($type = 'custom')
    {
        $postTypeHelper = vchelper('PostType');
        $data = [
            'post_type' => 'vcv_templates',
            'post_status' => 'publish',
        ];

        $templateId = $postTypeHelper->create($data);
        update_post_meta($templateId, '_' . VCV_PREFIX . 'id', uniqid('', true));

        update_post_meta($templateId, '_' . VCV_PREFIX . 'type', $type);

        vcevent('vcv:editor:template:create', ['templateId' => $templateId]);

        return $templateId;
    }

    public function read($id)
    {
        $template = $this->get($id);
        $postTypeHelper = vchelper('PostType');
        $postTypeHelper->setupPost($id);
        if ($template) {
            return [
                'status' => true,
                'data' => $template->vcvTemplateElements,
                'allData' => vcfilter(
                    'vcv:ajax:getData:adminNonce',
                    [],
                    [
                        'sourceId' => $id,
                    ]
                ),
            ];
        }

        return false;
    }

    /**
     * @param array $templates
     *
     * @return array
     */
    protected function groupQueryTemplates(array $templates)
    {
        $usageCount = vchelper('Options')->get('usageCount', []);
        // Merge JOIN results
        $result = [];
        foreach ($templates as $post) {
            if (!isset($result[ $post['id'] ])) {
                $result[ $post['id'] ] = $post;
                $result[ $post['id'] ]['type'] = 'custom'; // default type
                $usageCount = isset($usageCount[ 'template/' . $post['id'] ]) ? $usageCount[ 'template/' . $post['id'] ] : 0;
                $result[ $post['id'] ]['usageCount'] = $usageCount;
            }
            if (isset($post['meta_key']) && $post['meta_key'] === '_vcv-type') {
                $result[ $post['id'] ]['type'] = $post['meta_value'];
            }
            if (isset($post['meta_key']) && $post['meta_key'] === '_vcv-thumbnail') {
                $result[ $post['id'] ]['thumbnail'] = $post['meta_value'];
            }
            if (isset($post['meta_key']) && $post['meta_key'] === '_vcv-preview') {
                $result[ $post['id'] ]['preview'] = $post['meta_value'];
            }
            if (isset($post['meta_key']) && $post['meta_key'] === '_vcv-description') {
                $result[ $post['id'] ]['description'] = $post['meta_value'];
            }
            if (isset($post['meta_key']) && $post['meta_key'] === '_vcv-bundle') {
                $result[ $post['id'] ]['bundle'] = $post['meta_value'];
            }
        }

        // Group by Type
        $groupedResults = [];
        foreach ($result as $post) {
            $type = $post['type'];
            // @codingStandardsIgnoreLine
            if (!isset($groupedResults[ $type ])) {
                $groupedResults[ $type ] = [];
                $groupedResults[ $type ]['type'] = $type;
                $groupedResults[ $type ]['name'] = $this->getGroupName($type);
                $groupedResults[ $type ]['templates'] = [];
            }
            // Remove unneeded values
            unset($post['meta_key'], $post['meta_value']);

            // Append to result
            $groupedResults[ $type ]['templates'][] = $post;
        }

        return $groupedResults;
    }
}
