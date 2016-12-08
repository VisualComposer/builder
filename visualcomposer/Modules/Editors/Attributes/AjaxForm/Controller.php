<?php

namespace VisualComposer\Modules\Editors\Attributes\AjaxForm;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;

class Controller extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Editors\Attributes\AjaxForm\Controller::render */
        $this->addFilter(
            'vcv:ajax:attribute:ajaxForm:render:adminNonce',
            'render'
        );
    }

    /**
     * Get list of 20 most recent posts and pages with ability to search.
     *
     * @todo Add user permissions check.
     *
     * @param Request $request
     *
     * @return array
     */
    private function render(Request $request, $response)
    {
        $action = $request->input('vcv-form-action');
        $data = $request->input('vcv-form-data');
        // Do Filter with action/data

        // Output Result Form JSON
        $response['result'] = '';

        return $response;
    }
}
