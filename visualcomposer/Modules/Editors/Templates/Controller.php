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
        $this->addEvent('vcv:ajax:editorTemplates:all:adminNonce', 'all');

        /** @see \VisualComposer\Modules\Editors\Templates\Controller::create */
        $this->addEvent('vcv:ajax:editorTemplates:create:adminNonce', 'create');

        /** @see \VisualComposer\Modules\Editors\Templates\Controller::delete */
        $this->addEvent('vcv:ajax:editorTemplates:delete:adminNonce', 'delete');
    }

    private function all(EditorTemplates $editorTemplatesHelper)
    {
        return $editorTemplatesHelper->all();
    }

    /**
     * @CRUD
     */
    private function create(Request $requestHelper, PostType $postTypeHelper)
    {
        $data = $requestHelper->input('vcv-template-data');

        return [
            'status' => $postTypeHelper->create($data),
        ];
    }

    /**
     * @CRUD
     */
    private function delete(Request $requestHelper, PostType $postTypeHelper)
    {
        $id = $requestHelper->input('vcv-template-id');

        return [
            'status' => $postTypeHelper->delete($id, 'vcv_templates'),
        ];
    }
}
