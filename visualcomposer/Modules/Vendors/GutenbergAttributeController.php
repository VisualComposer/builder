<?php

namespace VisualComposer\Modules\Vendors;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class GutenbergAttributeController extends Container implements Module
{
    protected $postTypeSlug = 'vcv_gutenberg_attr';

    use WpFiltersActions;
    use EventsFilters;

    public function __construct()
    {
        $this->wpAddAction('init', 'initialize');
    }

    protected function initialize()
    {
        global $pagenow;
        $requestHelper = vchelper('Request');
        $currentUserAccessHelper = vchelper('AccessCurrentUser');
        if (function_exists('gutenberg_pre_init') && 'post-new.php' === $pagenow
            && $currentUserAccessHelper->wpAll(
                'edit_posts'
            )->get()
            && $requestHelper->input('post_type') === $this->postTypeSlug) {
            $this->registerGutenbergAttributeType();
            $this->wpAddAction('admin_print_styles', 'removeAdminUI');
            // $this->wpAddFilter('replace_editor', 'getGutenberg', 9, 2);
        }
    }

    protected function removeAdminUi()
    {
        ?>
        <style>
            #adminmenumain, #wpadminbar {
                display: none;
            }
        </style>
<?php
    }

    protected function getGutenberg()
    {
        add_action('admin_enqueue_scripts', 'gutenberg_editor_scripts_and_styles');
        add_filter('screen_options_show_screen', '__return_false');
        add_filter('admin_body_class', 'gutenberg_add_admin_body_class');
        require_once ABSPATH . 'wp-admin/admin-header.php';
        the_gutenberg_project();
    }

    protected function registerGutenbergAttributeType()
    {
        $labels = [
            'name' => _x('Gutenberg attrs', 'Post type general name', 'vcv'),
            'singular_name' => _x('Gutenberg attr', 'Post type singular name', 'vcv'),
            'menu_name' => _x('Gutenberg attrs', 'Admin Menu text', 'vcv'),
            'name_admin_bar' => _x('Gutenberg attr', 'Add New on Toolbar', 'vcv'),
            'add_new' => __('Add New', 'vcv'),
            'add_new_item' => __('Add New Gutenberg attr', 'vcv'),
            'new_item' => __('New Gutenberg attr', 'vcv'),
            'edit_item' => __('Edit Gutenberg attr', 'vcv'),
            'view_item' => __('View Gutenberg attr', 'vcv'),
            'all_items' => __('All Gutenberg attrs', 'vcv'),
            'search_items' => __('Search Gutenberg attrs', 'vcv'),
            'parent_item_colon' => __('Parent Gutenberg attrs:', 'vcv'),
            'not_found' => __('No Gutenberg attrs found.', 'vcv'),
            'not_found_in_trash' => __('No Gutenberg attrs found in Trash.', 'vcv'),
            'featured_image' => _x(
                'Gutenberg attr Cover Image',
                'Overrides the “Featured Image” phrase for this post type. Added in 4.3',
                'vcv'
            ),
            'set_featured_image' => _x(
                'Set cover image',
                'Overrides the “Set featured image” phrase for this post type. Added in 4.3',
                'vcv'
            ),
            'remove_featured_image' => _x(
                'Remove cover image',
                'Overrides the “Remove featured image” phrase for this post type. Added in 4.3',
                'vcv'
            ),
            'use_featured_image' => _x(
                'Use as cover image',
                'Overrides the “Use as featured image” phrase for this post type. Added in 4.3',
                'vcv'
            ),
            'archives' => _x(
                'Gutenberg attr archives',
                'The post type archive label used in nav menus. Default “Post Archives”. Added in 4.4',
                'vcv'
            ),
            'insert_into_item' => _x(
                'Add into Gutenberg attr',
                'Overrides the “Insert into post”/”Insert into page” phrase (used when inserting media into a post). Added in 4.4',
                'vcv'
            ),
            'uploaded_to_this_item' => _x(
                'Uploaded to this Gutenberg attr',
                'Overrides the “Uploaded to this post”/”Uploaded to this page” phrase (used when viewing media attached to a post). Added in 4.4',
                'vcv'
            ),
            'filter_items_list' => _x(
                'Filter Gutenberg attrs list',
                'Screen reader text for the filter links heading on the post type listing screen. Default “Filter posts list”/”Filter pages list”. Added in 4.4',
                'vcv'
            ),
            'items_list_navigation' => _x(
                'Gutenberg attrs list navigation',
                'Screen reader text for the pagination heading on the post type listing screen. Default “Posts list navigation”/”Pages list navigation”. Added in 4.4',
                'vcv'
            ),
            'items_list' => _x(
                'Gutenberg attrs list',
                'Screen reader text for the items list heading on the post type listing screen. Default “Posts list”/”Pages list”. Added in 4.4',
                'vcv'
            ),
        ];
        $args = [
            'labels' => $labels,
            'public' => false,
            'publicly_queryable' => false,
            'show_ui' => true,
            'show_in_menu' => false,
            'query_var' => false,
            'capability_type' => 'page',
            'has_archive' => false,
            'hierarchical' => false,
            'menu_position' => null,
            'show_in_rest' => true,
            'supports' => ['editor'],
        ];
        register_post_type($this->postTypeSlug, $args);
        // add_filter('gutenberg_can_edit_post_type', true, $this->postTypeSlug);
    }
}
