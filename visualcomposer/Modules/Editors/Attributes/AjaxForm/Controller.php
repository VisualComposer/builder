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
     * @param $response
     * @param $payload
     * @param Request $requestHelper
     *
     * @return array
     */
    protected function render($response, $payload, Request $requestHelper)
    {
        $action = $requestHelper->input('vcv-form-action');
        $element = $requestHelper->input('vcv-form-element');
        $value = $requestHelper->input('vcv-form-value');
        // Output Result Form JSON.
        if (!is_array($response)) {
            $response = [];
        }
        $response['html'] = '';
        $response['status'] = true;

        // Do Filter with action/data.
        $response = vcfilter(
            'vcv:ajaxForm:render:response',
            $response,
            [
                'action' => $action,
                'element' => $element,
                'value' => $value,
            ]
        );

        return $response;
    }
}
