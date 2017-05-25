<?php

namespace VisualComposer\Modules\Editors\Attributes\AjaxForm;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Access\CurrentUser;
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
     * @param \VisualComposer\Helpers\Access\CurrentUser $currentUserAccessHelper
     *
     * @return array
     */
    protected function render($response, $payload, Request $requestHelper, CurrentUser $currentUserAccessHelper)
    {
        $sourceId = (int)$requestHelper->input('vcv-source-id');
        if ($sourceId && $currentUserAccessHelper->wpAll(['edit_posts', $sourceId])->get()) {
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
        }

        return $response;
    }
}
