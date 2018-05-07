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
use VisualComposer\Helpers\Filters;
use VisualComposer\Helpers\Frontend;
use VisualComposer\Helpers\PostType;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Class Controller.
 */
class Controller extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    public function __construct()
    {
        if (!vcvenv('VCV_ENV_TEMPLATES_LOAD_ASYNC')) {
            $this->addFilter('vcv:editor:variables', 'allTemplates');
        } else {
            $this->addFilter('vcv:dataAjax:getData', 'allTemplatesAsync');
        }

        if (!vcvenv('VCV_ENV_TEMPLATES_FULL_SAVE')) {
            /** @see \VisualComposer\Modules\Editors\Templates\Controller::create */
            $this->addFilter('vcv:ajax:editorTemplates:create:adminNonce', 'create');
        }

        /** @see \VisualComposer\Modules\Editors\Templates\Controller::delete */
        $this->addFilter('vcv:ajax:editorTemplates:delete:adminNonce', 'delete');

        if (vcvenv('VCV_ENV_TEMPLATES_FULL_SAVE')) {
            $this->addFilter('vcv:dataAjax:setData:sourceId', 'saveTemplateId');
        }

        $this->wpAddFilter('template_include', 'templatesEditorBlankTemplate', 30);
    }

    /**
     * The Template editors should have always "blank" behaviour
     *
     * @param $originalTemplate
     * @param \VisualComposer\Helpers\PostType $postTypeHelper
     * @param \VisualComposer\Helpers\Frontend $frontendHelper
     *
     * @return string
     * @throws \VisualComposer\Framework\Illuminate\Container\BindingResolutionException
     */
    protected function templatesEditorBlankTemplate(
        $originalTemplate,
        PostType $postTypeHelper,
        Frontend $frontendHelper
    ) {
        if ($frontendHelper->isPageEditable()
            && in_array(
                $postTypeHelper->get()->post_type,
                ['vcv_templates']
            )) {
            $template = 'boxed-blank-template.php';

            return vcapp()->path('visualcomposer/resources/views/editor/templates/') . $template;
        }

        return $originalTemplate;
    }

    /**
     * @deprecated 2.5
     *
     * @param $variables
     * @param \VisualComposer\Helpers\EditorTemplates $editorTemplatesHelper
     *
     * @return array
     */
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

    /**
     * @param $response
     * @param \VisualComposer\Helpers\EditorTemplates $editorTemplatesHelper
     *
     * @return array
     */
    protected function allTemplatesAsync($response, EditorTemplates $editorTemplatesHelper)
    {
        if (!vcIsBadResponse($response)) {
            $response['templates'] = $editorTemplatesHelper->all();
        }

        return $response;
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
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\PostType $postTypeHelper
     * @param \VisualComposer\Helpers\Access\CurrentUser $currentUserAccessHelper
     * @param \VisualComposer\Helpers\Filters $filterHelper
     *
     * @return array
     */
    protected function create(
        Request $requestHelper,
        PostType $postTypeHelper,
        CurrentUser $currentUserAccessHelper,
        Filters $filterHelper
    ) {
        if ($currentUserAccessHelper->wpAll('publish_posts')->get()) {
            if (!vcvenv('VCV_ENV_TEMPLATES_FULL_SAVE')) {
                $data = $requestHelper->inputJson('vcv-template-data');
                $data['post_type'] = 'vcv_templates';
                $data['post_status'] = 'publish';
                $data['post_content'] = $filterHelper->fire('vcv:templates:create:content', $data['post_content']);
            } else {
                $data = [
                    'post_type' => 'vcv_templates',
                    'post_status' => 'vcv_templates',
                ];
            }
            $templateId = $postTypeHelper->create($data);
            update_post_meta($templateId, '_' . VCV_PREFIX . 'id', uniqid());

            if (!vcvenv('VCV_ENV_TEMPLATES_FULL_SAVE')) {
                if (!$requestHelper->exists('vcv-template-type')
                    || $requestHelper->input('vcv-template-type') === 'default') {
                    update_post_meta($templateId, '_' . VCV_PREFIX . 'type', 'custom');
                }
            } else {
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

    /**
     * @param $sourceId
     *
     * @return mixed
     * @throws \ReflectionException
     */
    protected function saveTemplateId($sourceId)
    {
        if ($sourceId === 'template') {
            $response = $this->call('create');
            if (!vcIsBadResponse($response)) {
                return $response['status']; // templateId
            }
        }

        return $sourceId;
    }
}
