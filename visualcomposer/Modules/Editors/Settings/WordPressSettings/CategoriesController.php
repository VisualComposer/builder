<?php

namespace VisualComposer\Modules\Editors\Settings\WordPressSettings;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\PostType;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;

class CategoriesController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        $this->addFilter(
            'vcv:ajax:editors:settings:add:category:adminNonce',
            'addNewCategory',
            11
        );
        $this->addFilter(
            'vcv:dataAjax:setData',
            'setData'
        );
        $this->addFilter(
            'vcv:editor:variables',
            'addCategoriesVariable'
        );
    }

    /**
     * @param $variables
     * @param \VisualComposer\Helpers\PostType $postTypeHelper
     *
     * @return array
     */
    protected function addCategoriesVariable(
        $variables,
        PostType $postTypeHelper
    ) {
        $currentPost = $postTypeHelper->get();
        if ($currentPost) {
            if ($this->isCategoryTaxonomyExist($currentPost->ID)) {
                $allCategories = get_categories(['hide_empty' => 0, 'hierarchical' => 1]);
                $usedCategories = get_the_category($currentPost->ID);
                $categoryData = ['used' => [], 'categories' => []];
                foreach ($usedCategories as $key => $value) {
                    // @codingStandardsIgnoreLine
                    $categoryData['used'][] = (string)$value->term_id;
                }
                foreach ($allCategories as $key => $value) {
                    $categoryData['categories'][] = [
                        'label' => $value->name,
                        // @codingStandardsIgnoreLine
                        'value' => $value->term_id,
                        // @codingStandardsIgnoreLine
                        'id' => $value->term_id,
                        'parent' => $value->parent,
                    ];
                }
                $variables[] = [
                    'key' => 'VCV_CATEGORIES',
                    'value' => $categoryData,
                ];
            }
        }

        return $variables;
    }

    /**
     * @param $postId
     *
     * @return bool
     */
    protected function isCategoryTaxonomyExist($postId)
    {
        $postTypeHelper = vchelper('PostType');
        $currentPost = $postTypeHelper->get($postId);
        if ($currentPost) {
            $postTypeTaxonomies = get_object_taxonomies($currentPost);
            if (in_array('category', $postTypeTaxonomies, true)) {
                $categoryTaxonomy = get_taxonomy('category');
                // @codingStandardsIgnoreLine
                if ($categoryTaxonomy->show_ui || false !== $categoryTaxonomy->meta_box_cb) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Set categories
     *
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\Request $requestHelper
     *
     * @return mixed
     */
    protected function setData($response, $payload, Request $requestHelper)
    {
        $currentPageId = $payload['sourceId'];
        $savedCategories = $requestHelper->input('vcv-settings-categories', []);
        if (!empty($savedCategories)) {
            $savedCategories = json_decode($savedCategories, true);
        }
        if (isset($currentPageId) && isset($savedCategories['used']) && $this->isCategoryTaxonomyExist($currentPageId)) {
            wp_set_post_categories($currentPageId, $savedCategories['used']);
        }

        return $response;
    }

    protected function addNewCategory($response, $payload, Request $requestHelper)
    {
        if ($requestHelper->exists('vcv-category')) {
            $categoryName = $requestHelper->input('vcv-category');
            $parentId = $requestHelper->input('vcv-parent-category', 0);
            $createCategory = wp_create_category($categoryName, $parentId);
            if ($createCategory) {
                $categoryData = get_term_by('term_id', $createCategory, 'category');

                // @codingStandardsIgnoreLine
                return [
                    'status' => true,
                    'label' => $categoryData->name,
                    // @codingStandardsIgnoreLine
                    'value' => $categoryData->term_id,
                    // @codingStandardsIgnoreLine
                    'id' => $categoryData->term_id,
                    'parent' => $categoryData->parent,
                ];
            }
        }

        return ['status' => false];
    }
}
