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
        $args = [
            'posts_per_page' => '-1',
            'post_type' => 'vcv_templates',
            'order' => 'asc',
        ];

        $templatesGroups = vchelper('PostType')->queryGroupByMetaKey(
            $args,
            '_' . VCV_PREFIX . 'type'
        );
        $dataHelper = vchelper('Data');
        $outputTemplates = [];
        if (!empty($templatesGroups)) {
            foreach ($templatesGroups as $groupKey => $templates) {
                $groupTemplates = [];
                foreach ($templates as $key => $template) {
                    /** @var $template \WP_Post */
                    $meta = get_post_meta($template->ID, VCV_PREFIX . 'pageContent', true);
                    $templateElements = [];
                    if (!vcvenv('VCV_FT_TEMPLATE_DATA_ASYNC')) {
                        $templateElements = $this->getTemplateElements($meta, $template);
                    }
                    $groupTemplates = $this->processTemplateElements($templateElements, $template, $groupTemplates);
                }
                if (!empty($groupTemplates)) {
                    if (empty($groupKey)) {
                        $groupKey = 'custom';
                    }
                    if (isset($outputTemplates[ $groupKey ]) && isset($outputTemplates[ $groupKey ]['name'])) {
                        $outputTemplates[ $groupKey ]['templates'] = $dataHelper->arrayDeepUnique(
                            array_merge($outputTemplates[ $groupKey ]['templates'], $groupTemplates)
                        );
                    } else {
                        $outputTemplates[ $groupKey ] = [
                            'name' => $this->getGroupName($groupKey),
                            'type' => $groupKey,
                            'templates' => $groupTemplates,
                        ];
                    }
                }
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
                $name = __('My Templates', 'visualcomposer');
                break;
            case 'hub':
            case 'predefined':
                $name = __('Hub Templates', 'visualcomposer');
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
            $templateElements = $templateElements = $this->getTemplateElements($meta, $template);
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

            $data = [
                // @codingStandardsIgnoreLine
                'name' => $template->post_title,
                'bundle' => $bundle,
                'id' => (string)$template->ID,
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
            $templateElements = get_post_meta($template->ID, 'vcvEditorTemplateElements', true);
        }

        return $templateElements;
    }

    public function getCustomTemplateOptions()
    {
        $templateGroups = $this->all();
        $options = [];
        $options[] = [
            'label' => __('Select a template', 'visualcomposer'),
            'value' => '',
        ];

        if (!empty($templateGroups) && isset($templateGroups['custom']) && isset($templateGroups['custom']['name'])) {
            $dataHelper = vchelper('Data');
            $groupData = $templateGroups['custom'];
            $name = $groupData['name'];
            $templateNames = $dataHelper->arrayColumn($groupData['templates'], 'name');
            $templateIds = $dataHelper->arrayColumn($groupData['templates'], 'id');

            $options[] = [
                'group' => [
                    'label' => $name,
                    'values' => array_map(
                        function ($templateName, $templateId) {
                            return [
                                'label' => $templateName,
                                'value' => $templateId,
                            ];
                        },
                        $templateNames,
                        $templateIds
                    ),
                ],
            ];
        }

        return $options;
    }

    public function create($type = 'custom')
    {
        $postTypeHelper = vchelper('PostType');
        $data = [
            'post_type' => 'vcv_templates',
            'post_status' => 'vcv_templates',
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
}
