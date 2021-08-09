<?php

namespace VisualComposer\Modules\Editors\Attributes\Checkbox;

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
        $this->addFilter(
            'vcv:ajax:attribute:checkbox:render:adminNonce',
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
        if ($sourceId && $currentUserAccessHelper->wpAll(['edit_post', $sourceId])->get()) {
            $tag = $requestHelper->input('vcv-tag');
            $element = $requestHelper->input('vcv-element');
            $fieldKey = $requestHelper->input('vcv-field-key');
            $fieldValue = $requestHelper->input('vcv-field-value');
            $action = $requestHelper->input('vcv-field-action');

            // Output Result Form JSON.
            if (!is_array($response)) {
                $response = [];
            }
            $response['results'] = [];
            // Do Filter with action/data.
            $response['status'] = true;
            $response = vcfilter(
                'vcv:attribute:checkbox:query:' . $action . ':render',
                $response,
                [
                    'tag' => $tag,
                    'fieldKey' => $fieldKey,
                    'fieldValue' => $fieldValue,
                    'action' => $action,
                    'element' => $element,
                ]
            );

            return $response;
        }

        return $response;
    }
}
