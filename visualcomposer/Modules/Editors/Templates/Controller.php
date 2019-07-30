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
        $this->addFilter('vcv:dataAjax:getData', 'allTemplatesAsync');

        $this->addFilter('vcv:ajax:editorTemplates:read:adminNonce', 'read');

        /** @see \VisualComposer\Modules\Editors\Templates\Controller::delete */
        $this->addFilter('vcv:ajax:editorTemplates:delete:adminNonce', 'delete');

        $this->addFilter('vcv:dataAjax:setData:sourceId', 'saveTemplateId');

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
            $template = 'blank-stretched-template.php';

            return vcapp()->path('visualcomposer/resources/views/editor/templates/') . $template;
        }

        return $originalTemplate;
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

    /**
     * @param \VisualComposer\Helpers\PostType $postTypeHelper
     * @param \VisualComposer\Helpers\Access\CurrentUser $currentUserAccessHelper
     *
     * @return array
     */
    protected function create(
        PostType $postTypeHelper,
        CurrentUser $currentUserAccessHelper
    ) {
        if ($currentUserAccessHelper->wpAll('publish_posts')->get()) {
            $data = [
                'post_type' => 'vcv_templates',
                'post_status' => 'vcv_templates',
            ];

            $templateId = $postTypeHelper->create($data);
            update_post_meta($templateId, '_' . VCV_PREFIX . 'id', uniqid());

            update_post_meta($templateId, '_' . VCV_PREFIX . 'type', 'custom');

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
     * @param \VisualComposer\Helpers\Access\CurrentUser $currentUserAccessHelper
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
     * CRUD -> read
     *
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\EditorTemplates $editorTemplatesHelper
     * @param \VisualComposer\Helpers\Access\CurrentUser $currentUserHelper
     *
     * @return array|bool
     */
    protected function read(
        Request $requestHelper,
        EditorTemplates $editorTemplatesHelper,
        CurrentUser $currentUserHelper,
        PostType $postTypeHelper
    ) {
        $id = $requestHelper->input('vcv-template-id');
        if ($currentUserHelper->wpAll(['edit_posts', $id])) {
            $template = $editorTemplatesHelper->get($id);
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
