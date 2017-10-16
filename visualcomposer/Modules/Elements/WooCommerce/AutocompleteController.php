<?php

namespace VisualComposer\Modules\Elements\WooCommerce;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
// use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;

class AutocompleteController extends Container/* implements Module*/
{
    use EventsFilters;

    public function __construct()
    {
        $this->addFilter('vcv:autocomplete:woocommerce:render', 'productIdAutocompleteSuggester');
        $this->addFilter('vcv:autocomplete:woocommerceCategory:render', 'productCategoryAutocompleteSuggester');
    }

    public function productIdAutocompleteSuggester($response, $payload)
    {
        /** @var \wpdb $wpdb */
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
                esc_sql($searchValue),
                esc_sql($searchValue)
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

    public function productCategoryAutocompleteSuggester($response, $payload)
    {
        /** @var \wpdb $wpdb */
        global $wpdb;
        $searchValue = $payload['searchValue'];
        $returnValue = $payload['returnValue'];
        $carId = (int)$searchValue;
        $searchValue = trim($searchValue);
        $postMetaInfos = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT a.term_id AS id, b.name as name, b.slug AS slug
						FROM {$wpdb->term_taxonomy} AS a
						INNER JOIN {$wpdb->terms} AS b ON b.term_id = a.term_id
						WHERE a.taxonomy = 'product_cat' AND (a.term_id = '%d' OR b.slug LIKE '%%%s%%' OR b.name LIKE '%%%s%%' )",
                $carId > 0 ? $carId : -1,
                esc_sql($searchValue),
                esc_sql($searchValue)
            ),
            ARRAY_A
        );

        $response['results'] = [];
        if (is_array($postMetaInfos) && !empty($postMetaInfos)) {
            foreach ($postMetaInfos as $value) {
                $data = [];
                $data['value'] = $returnValue ? $value[$returnValue] : $value['id'];
                $data['label'] = __('Id', 'vcwb') . ': ' . $value['id'] . ((strlen($value['name']) > 0) ? ' - '
                        . __('Name', 'vcwb') . ': ' . $value['name'] : '') . ((strlen($value['slug']) > 0)
                        ? ' - ' . __('Slug', 'vcwb') . ': ' . $value['slug'] : '');
                $response['results'][] = $data;
            }
        }

        return $response;
    }
}
