<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

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
            'orderby' => 'parent',
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
                'label' => __('All', 'vcwb'),
                'value' => '',
            ],
        ];
        $this->getCategoryChildsFull(0, 0, $categories, 0, $result);

        return $result;
    }

    /**
     * Get lists of categories.*
     *
     * @param $parentId
     * @param $pos
     * @param array $array
     * @param $level
     * @param array $dropdown - passed by  reference
     */
    protected function getCategoryChildsFull($parentId, $pos, $array, $level, &$dropdown)
    {
        for ($i = $pos; $i < count($array); $i++) {
            if ($array[ $i ]->category_parent == $parentId) {
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
}
