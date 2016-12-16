<?php

namespace VisualComposer\Modules\Editors\Templates;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class PostType extends Container implements Module
{
    use WpFiltersActions;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Editors\Templates\PostType::registerTemplatesPostType */
        $this->wpAddAction('init', 'registerTemplatesPostType');
    }

    /**
     * Post type from templates registration in wordpress
     */
    private function registerTemplatesPostType()
    {
        register_post_type(
            'vcv_templates',
            [
                'label' => 'VCWB Templates',
                'public' => false,
                'publicly_queryable' => false,
                'exclude_from_search' => false,
                'show_ui' => false,
                'show_in_menu' => true,
                'menu_position' => 10,
                'menu_icon' => 'dashicons-admin-page',
                'hierarchical' => false,
                'taxonomies' => [],
                'has_archive' => false,
                'rewrite' => false,
                'query_var' => false,
                'show_in_nav_menus' => false,
            ]
        );
    }
}
