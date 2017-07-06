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
            'vcv:ajax:autoComplete:findString:adminNonce',
            'render'
        );

        /** @see \VisualComposer\Modules\Editors\Attributes\AutoComplete\Controller::getTokenLabels */
        $this->addFilter(
            'vcv:ajax:autoComplete:getTokenLabels:adminNonce',
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

            global $wpdb;
            $productId = (int)$searchValue;
            $postMetaInfos = $wpdb->get_results(
                $wpdb->prepare(
                    "SELECT a.ID AS id, a.post_title AS title, b.meta_value AS sku
					FROM {$wpdb->posts} AS a
					LEFT JOIN ( SELECT meta_value, post_id  FROM {$wpdb->postmeta} WHERE `meta_key` = '_sku' ) AS b ON b.post_id = a.ID
					WHERE a.post_type = 'product' AND ( a.ID = '%d' OR b.meta_value LIKE '%%%s%%' OR a.post_title LIKE '%%%s%%' )",
                    $productId > 0 ? $productId : -1,
                    stripslashes($searchValue),
                    stripslashes($searchValue)
                ),
                ARRAY_A
            );

            $results = [];
            if (is_array($postMetaInfos) && !empty($postMetaInfos)) {
                foreach ($postMetaInfos as $value) {
                    $data = [];
                    $data['value'] = $value['id'];
                    $data['label'] = __('Id', 'js_composer') . ': ' . $value['id'] . ((strlen($value['title']) > 0)
                            ? ' - ' . __('Title', 'js_composer') . ': ' . $value['title'] : '') . ((strlen(
                                $value['sku']
                            ) > 0) ? ' - ' . __('Sku', 'js_composer') . ': ' . $value['sku'] : '');
                    $results[] = $data;
                }
            }

            return $results;
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
        if ($sourceId && $currentUserAccessHelper->wpAll(['edit_posts', $sourceId])->get()) {
            $tokenLabels = [];
            $tokens = $requestHelper->input('vcv-tokens');
            if ($tokens && is_array($tokens)) {
                foreach ($tokens as $token) {
                    $post = get_post($token);
                    // @codingStandardsIgnoreLine
                    $tokenLabels[ $token ] = $post->post_title;
                }
            }
        }

        return $tokenLabels;
    }
}
