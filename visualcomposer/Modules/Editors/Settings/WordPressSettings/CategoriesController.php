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
        if($currentPost) {
            $postTypeTaxonomies = get_object_taxonomies($currentPost);
            if (in_array('category', $postTypeTaxonomies)) {
                $categoryTaxonomy = get_taxonomy('category');
                // @codingStandardsIgnoreLine
                if ($categoryTaxonomy->show_ui || false !== $categoryTaxonomy->meta_box_cb) {
                    $allCategories = get_categories(['hide_empty'  => 0, 'hierarchical'=> 1]);
                    $usedCategories = get_the_category($currentPost->ID);
                    $categoryData = ['used' => [], 'categories' => []];
                    foreach ($usedCategories as $key => $value){
                        $categoryData['used'][] = $value->term_id;
                    }
                    foreach ($allCategories as $key => $value){
                        $categoryData['categories'][] = [
                            'label' => $value->name,
                            'value' => $value->term_id,
                            'id' => $value->term_id,
                            'parent' => $value->parent
                        ];
                    }
                    $variables[] = [
                        'key' => 'VCV_CATEGORIES',
                        'value' => $categoryData,
                    ];
                }
            }
        }
        return $variables;
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
        $savedCategories = $requestHelper->input('vcv-settings-categories', '');

        return $response;
    }
}
