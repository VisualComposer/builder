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
            $element = $requestHelper->input('vcv-element');
            $action = $requestHelper->input('vcv-autocomplete-action');
            $returnValue = $requestHelper->input('vcv-return-value');
            $returnValue = !$returnValue ? false : $returnValue;

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
                        'returnValue' => $returnValue,
                        'action' => $action,
                        'element' => $element,
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
                    'returnValue' => $returnValue,
                    'element' => $element,
                ]
            );

            return $response;
        }

        return $response;
    }

    /**
     * @param $response
     * @param $payload
     * @param Request $requestHelper
     * @param \VisualComposer\Helpers\Access\CurrentUser $currentUserAccessHelper
     *
     * @return array
     */
    protected function getTokenLabels(
        $response,
        $payload,
        Request $requestHelper,
        CurrentUser $currentUserAccessHelper
    ) {
        $sourceId = (int)$requestHelper->input('vcv-source-id');
        $action = $requestHelper->input('vcv-label-action');
        $returnValue = $requestHelper->input('vcv-return-value');
        $returnValue = !$returnValue ? false : $returnValue;

        $tokenLabels = [];

        if ($sourceId && $currentUserAccessHelper->wpAll(['edit_posts', $sourceId])->get()) {
            $tokens = $requestHelper->input('vcv-tokens');
            if ($tokens && is_array($tokens)) {
                $tokenLabels = $this->getLabels($tokens, $action, $returnValue, $requestHelper);
            }
        }

        return $tokenLabels;
    }

    /**
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param $tokens
     * @param $action
     * @param $returnValue
     *
     * @return mixed
     */
    protected function getLabels($tokens, $action, $returnValue, Request $requestHelper)
    {
        $tokenLabels = [];
        foreach ($tokens as $token) {
            $token = trim($token);

            $tokenLabels = $this->checkAction($action, $returnValue, $requestHelper, $token, $tokenLabels);

            if (empty($tokenLabels)) {
                $tokenLabels[ $token ] = false;
            }
        }

        return $tokenLabels;
    }

    /**
     * @param $action
     * @param $returnValue
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param $token
     * @param $tokenLabels
     *
     * @return mixed
     */
    protected function checkAction($action, $returnValue, Request $requestHelper, $token, $tokenLabels)
    {
        switch ($action) {
            case 'productAttribute':
                $attribute = taxonomy_exists('pa_' . $token);
                if ($attribute) {
                    $tokenLabels[ $token ] = $token;
                }
                break;
            case 'productFilter':
                $selectedAttribute = $requestHelper->input('vcv-element');
                $filter = get_term_by('slug', $token, 'pa_' . $selectedAttribute['atts_attribute']);
                if ($filter) {
                    $tokenLabels[ $token ] = $filter->name;
                }
                break;
            case 'product_cat':
                if ('slug' == $returnValue) {
                    $term = get_term_by('slug', $token, 'product_cat');
                } else {
                    $term = get_term_by('id', $token, 'product_cat');
                }
                if ($term) {
                    $tokenLabels[ $token ] = $term->name;
                }
                break;
            default:
                $post = get_post((int)$token);
                // @codingStandardsIgnoreLine
                if (isset($post) && !empty($post) && $post->post_status !== 'trash') {
                    // @codingStandardsIgnoreLine
                    $tokenLabels[ (int)$token ] = $post->post_title . ' (' . $post->ID . ')';
                }
        }

        $tokenLabels = vcfilter(
            'vcv:editor:autocomplete:checkAction',
            $tokenLabels,
            ['action' => $action, 'token' => $token, 'returnValue' => $returnValue]
        );

        return $tokenLabels;
    }
}
