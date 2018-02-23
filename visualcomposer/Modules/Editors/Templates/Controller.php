<?php

namespace VisualComposer\Modules\Editors\Templates;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Access\CurrentUser;
use VisualComposer\Helpers\EditorTemplates;
use VisualComposer\Helpers\PostType;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;

/**
 * Class Controller.
 */
class Controller extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Editors\Templates\Controller::allMyTemplates */
        $this->addFilter('vcv:backend:extraOutput vcv:frontend:body:extraOutput', 'allMyTemplates');
        /** @see \VisualComposer\Modules\Editors\Templates\Controller::allPredefinedTemplates */
        $this->addFilter('vcv:backend:extraOutput vcv:frontend:body:extraOutput', 'allPredefinedTemplates');
        $this->addFilter('vcv:editor:variables', 'allTemplates');

        /** @see \VisualComposer\Modules\Editors\Templates\Controller::create */
        $this->addFilter('vcv:ajax:editorTemplates:create:adminNonce', 'create');

        /** @see \VisualComposer\Modules\Editors\Templates\Controller::delete */
        $this->addFilter('vcv:ajax:editorTemplates:delete:adminNonce', 'delete');
    }

    protected function allTemplates($variables, EditorTemplates $editorTemplatesHelper)
    {
        $key = 'VCV_TEMPLATES';
        $value = $editorTemplatesHelper->all();

        $variables[] = [
            'key' => $key,
            'value' => $value,
            'type' => 'constant',
        ];

        return $variables;
    }

    protected function allMyTemplates($extraOutput, EditorTemplates $editorTemplatesHelper)
    {
        $extraOutput = array_merge(
            $extraOutput,
            [
                vcview(
                    'partials/constant-script',
                    [
                        'key' => 'VCV_MY_TEMPLATES',
                        'value' => [],
                    ]
                ),
            ]
        );

        return $extraOutput;
    }

    protected function allPredefinedTemplates($extraOutput, EditorTemplates $editorTemplatesHelper)
    {
        $extraOutput = array_merge(
            $extraOutput,
            [
                vcview(
                    'partials/constant-script',
                    [
                        'key' => 'VCV_PREDEFINED_TEMPLATES',
                        'value' => [],
                    ]
                ),
            ]
        );

        return $extraOutput;
    }

    protected function getData(array $templates)
    {
        $data = [];
        foreach ($templates as $template) {
            /** @var $template \WP_Post */
            $templateElements = get_post_meta($template->ID, 'vcvEditorTemplateElements', true);
            if (!empty($templateElements)) {
                $data[] = [
                    // @codingStandardsIgnoreLine
                    'name' => $template->post_title,
                    'data' => $templateElements,
                    'id' => (string)$template->ID,
                ];
            }
        }

        return $data;
    }

    /**
     * @CRUD
     *
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\PostType $postTypeHelper
     *
     * @return array
     */
    protected function create(Request $requestHelper, PostType $postTypeHelper, CurrentUser $currentUserAccessHelper)
    {
        if ($currentUserAccessHelper->wpAll('publish_posts')->get()) {
            $data = $requestHelper->inputJson('vcv-template-data');
            $data['post_type'] = 'vcv_templates';
            $data['post_status'] = 'publish';

            $templateId = $postTypeHelper->create($data);
            update_post_meta($templateId, '_' . VCV_PREFIX . 'id', uniqid());


            if (!$requestHelper->exists('vcv-template-type')
                || $requestHelper->input('vcv-template-type') === 'default') {
                update_post_meta($templateId, '_' . VCV_PREFIX . 'type', 'custom');
            }

            vcevent('vcv:editor:template:create', ['templateId' => $templateId]);

            return [
                'status' => $templateId,
            ];
        }

        return ['status' => false];
    }

    /**
     * @CRUD
     *
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\PostType $postTypeHelper
     *
     * @return array
     */
    protected function delete(Request $requestHelper, PostType $postTypeHelper, CurrentUser $currentUserAccessHelper)
    {
        if ($currentUserAccessHelper->wpAll('delete_published_posts')->get()) {
            $id = $requestHelper->input('vcv-template-id');

            return [
                'status' => $postTypeHelper->delete($id, 'vcv_templates'),
            ];
        }

        return ['status' => false];
    }
}
