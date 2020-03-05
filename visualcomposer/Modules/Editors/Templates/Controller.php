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
        /** @see \VisualComposer\Modules\Editors\Templates\Controller::allTemplatesAsync */
        $this->addFilter('vcv:dataAjax:getData', 'allTemplatesAsync');

        /** @see \VisualComposer\Modules\Editors\Templates\Controller::read */
        $this->addFilter('vcv:ajax:editorTemplates:read:adminNonce', 'read');

        /** @see \VisualComposer\Modules\Editors\Templates\Controller::delete */
        $this->addFilter('vcv:ajax:editorTemplates:delete:adminNonce', 'delete');

        /** @see \VisualComposer\Modules\Editors\Templates\Controller::saveTemplateId */
        $this->addFilter('vcv:dataAjax:setData:sourceId', 'saveTemplateId');

        /** @see \VisualComposer\Modules\Editors\Templates\Controller::templatesEditorBlankTemplate */
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
        if (
            $frontendHelper->isPageEditable()
            && $postTypeHelper->get()->post_type === 'vcv_templates'
        ) {
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
     * @param \VisualComposer\Helpers\Access\CurrentUser $currentUserAccessHelper
     * @param \VisualComposer\Helpers\EditorTemplates $editorTemplatesHelper
     *
     * @return bool|integer
     */
    protected function create(CurrentUser $currentUserAccessHelper, EditorTemplates $editorTemplatesHelper)
    {
        if ($currentUserAccessHelper->wpAll('publish_posts')->get()) {
            $templateId = $editorTemplatesHelper->create('custom');
            if ($templateId) {
                return $templateId;
            }
        }

        return false;
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
        CurrentUser $currentUserHelper
    ) {
        $id = $requestHelper->input('vcv-template-id');
        if ($currentUserHelper->wpAll(['edit_posts', $id])) {
            $template = $editorTemplatesHelper->read($id);
            if ($template) {
                return $template;
            }
        }

        return ['status' => false];
    }

    /**
     * @param $sourceId
     *
     * @return mixed
     * @throws \ReflectionException
     * @throws \VisualComposer\Framework\Illuminate\Container\BindingResolutionException
     */
    protected function saveTemplateId($sourceId)
    {
        if ($sourceId === 'template') {
            /** @see \VisualComposer\Modules\Editors\Templates\Controller::create */
            $templateId = $this->call('create');
            if ($templateId) {
                // Create template ID
                if (!get_post_meta($sourceId, '_' . VCV_PREFIX . 'id', true)) {
                    update_post_meta($sourceId, '_' . VCV_PREFIX . 'id', uniqid('', true));
                }

                return $templateId;
            }

            return ['status' => false];
        }

        return $sourceId;
    }
}
