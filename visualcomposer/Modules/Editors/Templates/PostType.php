<?php

namespace VisualComposer\Modules\Editors\Templates;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Traits\EventsFilters;

class PostType extends Container implements Module
{
    use EventsFilters;

    protected $postType = 'vcv_templates';

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Editors\Templates\PostType::registerTemplatesPostType */
        $this->addEvent('vcv:inited', 'registerTemplatesPostType', 10);
        $this->addEvent('vcv:inited', 'coreCapabilities');
    }

    /**
     * Post type from templates registration in wordpress
     */
    protected function registerTemplatesPostType()
    {
        register_post_type(
            $this->postType,
            [
                'label' => __('Global Templates', 'vcwb'),
                'public' => false,
                'publicly_queryable' => false,
                'exclude_from_search' => true,
                'show_ui' => false,
                'show_in_menu' => false,
                'menu_position' => 10,
                'menu_icon' => 'dashicons-admin-page',
                'hierarchical' => false,
                'taxonomies' => [],
                'has_archive' => false,
                'rewrite' => false,
                'query_var' => false,
                'show_in_nav_menus' => false,
                'capability_type' => $this->postType,
                'capabilities' => [
                    'edit_post' => 'edit_' . $this->postType,
                    'read_post' => 'read_' . $this->postType,
                    'delete_post' => 'delete_' . $this->postType,
                    'edit_posts' => 'edit_' . $this->postType . 's',
                    'edit_others_posts' => 'edit_others_' . $this->postType . 's',
                    'publish_posts' => 'publish_' . $this->postType . 's',
                    'create_posts' => 'edit_' . $this->postType . 's',
                    'edit_published_posts' => 'edit_published_' . $this->postType . 's',
                    'delete_posts' => 'delete_' . $this->postType . 's',
                    'delete_published_posts' => 'delete_published_' . $this->postType . 's',
                    'delete_others_posts' => 'delete_others_' . $this->postType . 's',
                    'read' => 'read_' . $this->postType,
                ],
            ]
        );
    }

    protected function coreCapabilities()
    {
        $roles = ['administrator', 'editor', 'author', 'contributor'];

        foreach ($roles as $role) {
            $capabilities = [
                "read_{$this->postType}",
            ];

            if (in_array($role, ['administrator', 'editor'])) {
                $capabilities = [
                    "edit_{$this->postType}",
                    "read_{$this->postType}",
                    "delete_{$this->postType}",
                    "edit_{$this->postType}s",
                    "edit_others_{$this->postType}s",
                    "publish_{$this->postType}s",
                    "create_{$this->postType}s",
                    "delete_{$this->postType}s",
                    "delete_published_{$this->postType}s",
                    "delete_others_{$this->postType}s",
                    "edit_published_{$this->postType}s",
                ];
            }

            $role = get_role($role);
            if ($role) {
                foreach ($capabilities as $cap) {
                    $role->add_cap($cap);
                }
            }
        }
    }
}
