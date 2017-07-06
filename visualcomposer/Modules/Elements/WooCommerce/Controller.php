<?php

namespace VisualComposer\Modules\Elements\WooCommerce;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;

class Controller extends Container implements Module
{
    public function productIdAutocompleteSuggester($searchValue)
    {
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

        return $results
    }
}
