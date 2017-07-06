<?php

namespace VisualComposer\Modules\Elements\WooCommerce;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;

class Controller extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        $this->addFilter('vcv:autocomplete:product:id:render', 'productIdAutocompleteSuggester');
        $this->addFilter('vcv:autocomplete:products:ids:render', 'productIdAutocompleteSuggester');
        $this->addFilter('vcv:autocomplete:add_to_cart:id:render', 'productIdAutocompleteSuggester');
        $this->addFilter('vcv:autocomplete:add_to_cart_url:id:render', 'productIdAutocompleteSuggester');
        $this->addFilter('vcv:autocomplete:product_page:id:render', 'productIdAutocompleteSuggester');
    }

    public function productIdAutocompleteSuggester($response, $payload)
    {
        global $wpdb;
        $searchValue = $payload['searchValue'];
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
        $response['results'] = [];
        if (is_array($postMetaInfos) && !empty($postMetaInfos)) {
            foreach ($postMetaInfos as $value) {
                $data = [];
                $data['value'] = $value['id'];
                $data['label'] = __('Id', 'vcwb') . ': ' . $value['id'] . ((strlen($value['title']) > 0)
                        ? ' - ' . __('Title', 'vcwb') . ': ' . $value['title'] : '') . ((strlen(
                            $value['sku']
                        ) > 0) ? ' - ' . __('Sku', 'vcwb') . ': ' . $value['sku'] : '');
                $response['results'][] = $data;
            }
        }

        return $response;
    }
}
