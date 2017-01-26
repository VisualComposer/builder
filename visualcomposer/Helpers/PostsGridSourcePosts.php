<?php

namespace VisualComposer\Helpers;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Helper;

class PostsGridSourcePosts extends Container implements Helper
{
    public function getPostsCategories()
    {
        $args = [
            'type' => 'post',
            'child_of' => 0,
            'parent' => '',
            'orderby' => 'parent_id',
            'order' => 'ASC',
            'hide_empty' => false,
            'hierarchical' => 1,
            'exclude' => '',
            'include' => '',
            'number' => '',
            'taxonomy' => 'category',
            'pad_counts' => false,

        ];
        // All this move to product
        $categories = get_categories($args);

        $result = [
            [
                'label' => __('All', 'vc5'),
                'value' => '',
            ],
        ];
        $this->getCategoryChildsFull(0, 0, $categories, 0, $result);

        return $result;
    }

    /**
     * Get lists of categories.*
     *
     * @param $parent_id
     * @param $pos
     * @param array $array
     * @param $level
     * @param array $dropdown - passed by  reference
     */
    protected function getCategoryChildsFull($parent_id, $pos, $array, $level, &$dropdown)
    {
        for ($i = $pos; $i < count($array); $i++) {
            if ($array[ $i ]->category_parent == $parent_id) {
                $name = str_repeat('- ', $level) . $array[ $i ]->name;
                $value = $array[ $i ]->term_id;
                $dropdown[] = [
                    'label' => $name,
                    'value' => $value,
                ];
                $this->getCategoryChildsFull($array[ $i ]->term_id, $i, $array, $level + 1, $dropdown);
            }
        }
    }

    public function getPostTypes()
    {
        $postTypes = get_post_types([]);
        $postTypesList = [];
        $excludedPostTypes = [
            'revision',
            'nav_menu_item',
            'vc_grid_item',
        ];
        if (is_array($postTypes) && !empty($postTypes)) {
            foreach ($postTypes as $postType) {
                if (!in_array($postType, $excludedPostTypes)) {
                    $label = ucfirst($postType);
                    $postTypesList[] = [
                        'label' => $label,
                        'value' => $postType,
                    ];
                }
            }
        }

        /*
        $postTypesList[] = [
            'value' => 'custom',
            'label' => __('Custom Query', 'vc5'),
        ];
        $postTypesList[] = [
            'value' => 'ids',
            'label' => __('List of IDs', 'vc5'),
        ];
        */

        return $postTypesList;
    }
}
