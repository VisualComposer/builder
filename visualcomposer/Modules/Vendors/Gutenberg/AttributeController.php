<?php

namespace VisualComposer\Modules\Vendors\Gutenberg;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Traits\EventsFilters;

/**
 * Registers post type vc_gutenberg_attr for custom edit form attribute gutenberg
 *
 * Class AttributeController
 * @package VisualComposer\Modules\Vendors\Gutenberg
 */
class AttributeController extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    /**
     * @var string
     */
    protected $postTypeSlug = 'vcv_gutenberg_attr';

    /**
     * AttributeController constructor.
     */
    public function __construct()
    {
        $this->wpAddAction('init', 'initialize');
        $this->addFilter('vcv:frontend:content vcv:frontend:content:encode', 'doGutenbergBlocks');
    }

    /**
     * Register inner post type for attribute
     */
    protected function initialize()
    {
        global $pagenow;
        $requestHelper = vchelper('Request');
        $currentUserAccessHelper = vchelper('AccessCurrentUser');
        $postID = $requestHelper->input('post');
        $isGutentebergPostType = $postID && get_post_type($postID) === $this->postTypeSlug;
        if (
            $isGutentebergPostType
            || (
                'post-new.php' === $pagenow
                && $requestHelper->input('post_type') === $this->postTypeSlug
                && $currentUserAccessHelper->wpAll(
                    ['edit_posts']
                )->get()
            )
        ) {
            $this->registerGutenbergAttributeType();
            /** @see \VisualComposer\Modules\Vendors\Gutenberg\AttributeController::removeUiMetaboxes */
            $this->wpAddAction('add_meta_boxes', 'removeUiMetaboxes', 100);
            /** @see \VisualComposer\Modules\Vendors\Gutenberg\AttributeController::removeAdminUi */
            $this->wpAddAction('admin_print_styles', 'removeAdminUi');
            // @codingStandardsIgnoreStart
            global $wp_version;
            $wpVersion = $wp_version;
            // @codingStandardsIgnoreEnd
            if (version_compare($wpVersion, '4.9.8', '<=') && function_exists('the_gutenberg_project')) {
                /** @see \VisualComposer\Modules\Vendors\Gutenberg\AttributeController::getGutenberg */
                $this->wpAddFilter('replace_editor', 'getGutenberg', 9, 2);
            }
            // Always enable the gutenberg block editor through visualcomposer editor
            $this->wpAddFilter('use_block_editor_for_post', '__return_true');
            $this->wpAddFilter('gutenberg_can_edit_post_type', '__return_true');
        }
    }

    /**
     * Register post type for vc_gutenberg attribute type
     */
    protected function registerGutenbergAttributeType()
    {
        $labels = [
            'name' => _x('Gutenberg attrs', 'Post type general name', 'visualcomposer'),
            'singular_name' => _x('Gutenberg attr', 'Post type singular name', 'visualcomposer'),
            'menu_name' => _x('Gutenberg attrs', 'Admin Menu text', 'visualcomposer'),
            'name_admin_bar' => _x('Gutenberg attr', 'Add New on Toolbar', 'visualcomposer'),
            'add_new' => __('Add New', 'visualcomposer'),
            'add_new_item' => __('Add New Gutenberg attr', 'visualcomposer'),
            'new_item' => __('New Gutenberg attr', 'visualcomposer'),
            'edit_item' => __('Edit Gutenberg attr', 'visualcomposer'),
            'view_item' => __('View Gutenberg attr', 'visualcomposer'),
            'all_items' => __('All Gutenberg attrs', 'visualcomposer'),
            'search_items' => __('Search Gutenberg attrs', 'visualcomposer'),
            'parent_item_colon' => __('Parent Gutenberg attrs:', 'visualcomposer'),
            'not_found' => __('No Gutenberg attrs found.', 'visualcomposer'),
            'not_found_in_trash' => __('No Gutenberg attrs found in Trash.', 'visualcomposer'),
            'featured_image' => _x(
                'Gutenberg attr Cover Image',
                'Overrides the “Featured Image” phrase for this post type. Added in 4.3',
                'visualcomposer'
            ),
            'set_featured_image' => _x(
                'Set cover image',
                'Overrides the “Set featured image” phrase for this post type. Added in 4.3',
                'visualcomposer'
            ),
            'remove_featured_image' => _x(
                'Remove cover image',
                'Overrides the “Remove featured image” phrase for this post type. Added in 4.3',
                'visualcomposer'
            ),
            'use_featured_image' => _x(
                'Use as a cover image',
                'Overrides the “Use as featured image” phrase for this post type. Added in 4.3',
                'visualcomposer'
            ),
            'archives' => _x(
                'Gutenberg attr archives',
                'The post type archive label used in nav menus. Default “Post Archives”. Added in 4.4',
                'visualcomposer'
            ),
            'insert_into_item' => _x(
                'Add into Gutenberg attr',
                'Overrides the “Insert into post”/”Insert into page” phrase (used when inserting media into a post). Added in 4.4',
                'visualcomposer'
            ),
            'uploaded_to_this_item' => _x(
                'Uploaded to this Gutenberg attr',
                'Overrides the “Uploaded to this post”/”Uploaded to this page” phrase (used when viewing media attached to a post). Added in 4.4',
                'visualcomposer'
            ),
            'filter_items_list' => _x(
                'Filter Gutenberg attrs list',
                'Screen reader text for the filter links heading on the post type listing screen. Default “Filter posts list”/”Filter pages list”. Added in 4.4',
                'visualcomposer'
            ),
            'items_list_navigation' => _x(
                'Gutenberg attrs list navigation',
                'Screen reader text for the pagination heading on the post type listing screen. Default “Posts list navigation”/”Pages list navigation”. Added in 4.4',
                'visualcomposer'
            ),
            'items_list' => _x(
                'Gutenberg attrs list',
                'Screen reader text for the items list heading on the post type listing screen. Default “Posts list”/”Pages list”. Added in 4.4',
                'visualcomposer'
            ),
        ];
        $args = [
            'labels' => $labels,
            'public' => true,
            'publicly_queryable' => true,
            'show_ui' => true,
            'show_in_menu' => false,
            'query_var' => false,
            'capability_type' => 'post',
            'has_archive' => false,
            'hierarchical' => false,
            'menu_position' => null,
            'show_in_rest' => true,
            'supports' => ['editor'],
        ];
        register_post_type($this->postTypeSlug, $args);
    }

    /**
     * Remove admin CSS for gutenberg attribute page
     */
    protected function removeAdminUi()
    {
        echo '
        <style>
          #adminmenumain, #wpadminbar {
            display: none;
          }

          html.wp-toolbar {
            padding: 0 !important;
          }

          .wp-toolbar #wpcontent {
            margin: 0;
          }

          .wp-toolbar #wpbody {
            padding-top: 0;
          }

          .gutenberg .gutenberg__editor .edit-post-layout .edit-post-header, html .block-editor-page .edit-post-header {
            top: 0;
            left: 0;
          }

          .gutenberg .gutenberg__editor .edit-post-layout.is-sidebar-opened .edit-post-layout__content, html .block-editor-page .edit-post-layout.is-sidebar-opened .edit-post-layout__content {
            margin-right: 0;
          }

          .gutenberg .gutenberg__editor .edit-post-layout .editor-post-publish-panel, html .block-editor-page .edit-post-layout .editor-post-publish-panel, html .block-editor-page .edit-post-header__settings {
            display: none;
          }

          .components-panel__header.edit-post-sidebar-header.edit-post-sidebar__panel-tabs li:first-child {
            display: none;
          }

          .post-type-vcv_gutenberg_attr .edit-post-layout.block-editor-editor-skeleton {
            left: 0;
            top: 0;
          }

        </style>';
    }

    /**
     * Remove all metaboxes in gutenberg attribute
     */
    protected function removeUiMetaboxes()
    {
        $globalsHelper = vchelper('Globals');
        $globalsHelper->set('wp_meta_boxes', [
            'vcv_gutenberg_attr' => [
                'normal' => [
                    'core' => [],
                ],
            ],
        ]);
    }

    /**
     * < 4.9 WordPress
     */
    protected function getGutenberg()
    {
        add_action('admin_enqueue_scripts', 'gutenberg_editor_scripts_and_styles');
        add_filter('screen_options_show_screen', '__return_false');
        add_filter('admin_body_class', 'gutenberg_add_admin_body_class');
        include_once ABSPATH . 'wp-admin/admin-header.php';
        the_gutenberg_project();
    }

    protected function doGutenbergBlocks($content, $payload)
    {
        if (function_exists('do_blocks')) {
            $content = do_blocks($content);
        }

        return $content;
    }
}
