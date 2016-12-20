<?php

namespace VisualComposer\Modules\Editors\Templates;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Framework\Container;
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
        /** @see \VisualComposer\Modules\Editors\Templates\Controller::all */
        $this->addFilter('vcv:frontend:extraOutput', 'all');

        /** @see \VisualComposer\Modules\Editors\Templates\Controller::create */
        $this->addFilter('vcv:ajax:editorTemplates:create:adminNonce', 'create');

        /** @see \VisualComposer\Modules\Editors\Templates\Controller::delete */
        $this->addFilter('vcv:ajax:editorTemplates:delete:adminNonce', 'delete');
    }

    private function all($extraOutput, EditorTemplates $editorTemplatesHelper)
    {
        $extraOutput[] = '<script>
    window.vcvMyTemplates = ' . json_encode($this->getData($editorTemplatesHelper->all())) . '
</script>';

        return $extraOutput;
    }

    private function getData($templates)
    {
        $data = [];
        foreach ($templates as $template) {
            /** @var $template \WP_Post */
            $data[] = [
                'name' => $template->post_title,
                'data' => [], // TODO: Get post meta,
                'id' => $template->ID,
            ];
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
    private function create(Request $requestHelper, PostType $postTypeHelper)
    {
        $data = $requestHelper->input('vcv-template-data');
        $data['post_type'] = 'vcv_templates';
        $data['post_status'] = 'publish';

        return [
            'status' => $postTypeHelper->create($data),
        ];
    }

    /**
     * @CRUD
     *
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\PostType $postTypeHelper
     *
     * @return array
     */
    private function delete(Request $requestHelper, PostType $postTypeHelper)
    {
        $id = $requestHelper->input('vcv-template-id');

        return [
            'status' => $postTypeHelper->delete($id, 'vcv_templates'),
        ];
    }
}
