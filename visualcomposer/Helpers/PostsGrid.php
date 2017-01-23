<?php

namespace VisualComposer\Helpers;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Helper;

class PostsGrid extends Container implements Helper
{
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
        $postTypesList[] = [
            'value' => 'custom',
            'label' => __('Custom Query', 'vc5'),
        ];
        $postTypesList[] = [
            'value' => 'ids',
            'label' => __('List of IDs', 'vc5'),
        ];

        return $postTypesList;
    }
}
