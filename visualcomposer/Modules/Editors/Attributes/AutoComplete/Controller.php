<?php

namespace VisualComposer\Modules\Editors\Attributes\AutoComplete;

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
        /** @see \VisualComposer\Modules\Editors\Attributes\AutoComplete\Controller::render */
        $this->addFilter(
            'vcv:ajax:autocomplete:findString:adminNonce',
            'render'
        );

        /** @see \VisualComposer\Modules\Editors\Attributes\AutoComplete\Controller::getTokenLabels */
        $this->addFilter(
            'vcv:ajax:autocomplete:getTokenLabels:adminNonce',
            'getTokenLabels'
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
            $searchValue = $requestHelper->input('vcv-search');
            $tag = $requestHelper->input('vcv-tag');
            $param = $requestHelper->input('vcv-param');
            $action = $requestHelper->input('vcv-autocomplete-action');

            // Output Result Form JSON.
            if (!is_array($response)) {
                $response = [];
            }
            $response['results'] = '';
            $response['status'] = true;

            // Do Filter with action/data.
            if (!empty($action)) {
                $response = vcfilter(
                    'vcv:autocomplete:' . $action . ':render',
                    $response,
                    [
                        'tag' => $tag,
                        'param' => $param,
                        'searchValue' => $searchValue,
                        'action' => $action,
                    ]
                );
            }
            $response = vcfilter(
                'vcv:autocomplete:' . $tag . ':' . $param . ':render',
                $response,
                [
                    'tag' => $tag,
                    'param' => $param,
                    'searchValue' => $searchValue,
                ]
            );

            return $response;
        }
    }

    /**
     * @param $response
     * @param $payload
     * @param Request $requestHelper
     * @param \VisualComposer\Helpers\Access\CurrentUser $currentUserAccessHelper
     *
     * @return array
     */
    protected function getTokenLabels($response, $payload, Request $requestHelper, CurrentUser $currentUserAccessHelper)
    {
        $sourceId = (int)$requestHelper->input('vcv-source-id');
        $tokenLabels = [];

        if ($sourceId && $currentUserAccessHelper->wpAll(['edit_posts', $sourceId])->get()) {
            $tokens = $requestHelper->input('vcv-tokens');
            if ($tokens && is_array($tokens)) {
                foreach ($tokens as $token) {
                    $post = get_post((int)$token);
                    if ($post) {
                        // @codingStandardsIgnoreLine
                        $tokenLabels[ (int)$token ] = $post->post_title;
                    } else {
                        $tokenLabels[ (int)$token ] = false;
                    }
                }
            }
        }

        return $tokenLabels;
    }
}
