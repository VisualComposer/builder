<?php

namespace VisualComposer\Modules\Vendors;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Access\CurrentUser;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Settings\SettingsHelper;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Modules\Settings\Traits\Fields;

class GutenbergAttributeController extends Container implements Module
{
    protected $postTypeSlug = 'vcv_gutenberg_attr';
    protected $removeGutenberg = null;

    use WpFiltersActions;
    use EventsFilters;
    use Fields;

    public function getSlug()
    {
        /** @var Settings $settings */
        $settings = vcapp('SettingsPagesSettings');

        return $settings->getSlug();
    }

    public function __construct()
    {
        $this->wpAddAction('init', 'initialize');

        $this->optionGroup = $this->getSlug();
        $this->optionSlug = 'vcv-gutenberg-editor';
        if (function_exists('the_gutenberg_project')) {
            $this->addFilter('vcv:helpers:settingsDefault', 'defaultSettings');
            /** @see  \VisualComposer\Modules\Vendors\GutenbergAttributeController::buildPage */
            $this->wpAddAction(
                'vcv:settings:initAdmin:page:' . $this->getSlug(),
                'buildPage',
                90
            );
            $this->call('disableGutenberg');
        }
        $this->addEvent('vcv:system:factory:reset', 'unsetOptions');
    }

    protected function buildPage(CurrentUser $currentUserAccess)
    {
        if (!$currentUserAccess->wpAll('manage_options')->get()) {
            return;
        }

        $sectionCallback = function () {
            echo sprintf(
                '<p class="description">%s</p>',
                esc_html__(
                    'Enable/disable Gutenberg editor for your WordPress site. Disabling Gutenberg editor will enable Classic WordPress editor. In both cases, you can still use Visual Composer.',
                    'vcwb'
                )
            );
        };

        $this->addSection(
            [
                'title' => __('Gutenberg Editor', 'vcwb'),
                'page' => $this->getSlug(),
                'callback' => $sectionCallback,
            ]
        );

        $fieldCallback = function () {
            /** @see \VisualComposer\Modules\Vendors\GutenbergAttributeController::renderToggle */
            echo $this->call('renderToggle', ['value' => 'gutenberg-editor']);
        };

        $this->addField(
            [
                'page' => $this->getSlug(),
                'title' => __('Editor', 'vcwb'),
                'name' => 'settings',
                'id' => 'vcv-settings-gutenberg-editor',
                'fieldCallback' => $fieldCallback,
            ]
        );
    }

    protected function renderToggle($value, Options $optionsHelper)
    {
        return vcview(
            'settings/option-toggle',
            [
                'value' => $value,
                'enabledOptions' => (array)$optionsHelper->get('settings', []),
            ]
        );
    }

    protected function disableGutenberg(SettingsHelper $settingsHelper)
    {
        $settings = $settingsHelper->getAll();
        if (function_exists('the_gutenberg_project')
            && !in_array(
                'gutenberg-editor',
                $settings
            )) {
            $this->removeGutenberg = $this->wpAddFilter('gutenberg_can_edit_post_type', '__return_false');
        }
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
            html.wp-toolbar {
                padding: 0 !important;
            }
            .wp-toolbar #wpcontent {
                margin: 0;
            }
            .wp-toolbar #wpbody {
                padding-top: 0;
            }
            .gutenberg .gutenberg__editor .edit-post-layout .edit-post-header {
                top: 0;
                left: 0;
            }
            .gutenberg .gutenberg__editor .edit-post-layout.is-sidebar-opened .edit-post-layout__content {
                margin-right: 0;
            }
            .gutenberg .gutenberg__editor .edit-post-layout .editor-post-publish-panel {
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
            'name' => _x('Gutenberg attrs', 'Post type general name', 'vcwb'),
            'singular_name' => _x('Gutenberg attr', 'Post type singular name', 'vcwb'),
            'menu_name' => _x('Gutenberg attrs', 'Admin Menu text', 'vcwb'),
            'name_admin_bar' => _x('Gutenberg attr', 'Add New on Toolbar', 'vcwb'),
            'add_new' => __('Add New', 'vcwb'),
            'add_new_item' => __('Add New Gutenberg attr', 'vcwb'),
            'new_item' => __('New Gutenberg attr', 'vcwb'),
            'edit_item' => __('Edit Gutenberg attr', 'vcwb'),
            'view_item' => __('View Gutenberg attr', 'vcwb'),
            'all_items' => __('All Gutenberg attrs', 'vcwb'),
            'search_items' => __('Search Gutenberg attrs', 'vcwb'),
            'parent_item_colon' => __('Parent Gutenberg attrs:', 'vcwb'),
            'not_found' => __('No Gutenberg attrs found.', 'vcwb'),
            'not_found_in_trash' => __('No Gutenberg attrs found in Trash.', 'vcwb'),
            'featured_image' => _x(
                'Gutenberg attr Cover Image',
                'Overrides the “Featured Image” phrase for this post type. Added in 4.3',
                'vcwb'
            ),
            'set_featured_image' => _x(
                'Set cover image',
                'Overrides the “Set featured image” phrase for this post type. Added in 4.3',
                'vcwb'
            ),
            'remove_featured_image' => _x(
                'Remove cover image',
                'Overrides the “Remove featured image” phrase for this post type. Added in 4.3',
                'vcwb'
            ),
            'use_featured_image' => _x(
                'Use as cover image',
                'Overrides the “Use as featured image” phrase for this post type. Added in 4.3',
                'vcwb'
            ),
            'archives' => _x(
                'Gutenberg attr archives',
                'The post type archive label used in nav menus. Default “Post Archives”. Added in 4.4',
                'vcwb'
            ),
            'insert_into_item' => _x(
                'Add into Gutenberg attr',
                'Overrides the “Insert into post”/”Insert into page” phrase (used when inserting media into a post). Added in 4.4',
                'vcwb'
            ),
            'uploaded_to_this_item' => _x(
                'Uploaded to this Gutenberg attr',
                'Overrides the “Uploaded to this post”/”Uploaded to this page” phrase (used when viewing media attached to a post). Added in 4.4',
                'vcwb'
            ),
            'filter_items_list' => _x(
                'Filter Gutenberg attrs list',
                'Screen reader text for the filter links heading on the post type listing screen. Default “Filter posts list”/”Filter pages list”. Added in 4.4',
                'vcwb'
            ),
            'items_list_navigation' => _x(
                'Gutenberg attrs list navigation',
                'Screen reader text for the pagination heading on the post type listing screen. Default “Posts list navigation”/”Pages list navigation”. Added in 4.4',
                'vcwb'
            ),
            'items_list' => _x(
                'Gutenberg attrs list',
                'Screen reader text for the items list heading on the post type listing screen. Default “Posts list”/”Pages list”. Added in 4.4',
                'vcwb'
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
        $this->wpRemoveFilter('gutenberg_can_edit_post_type', $this->removeGutenberg);
    }

    protected function unsetOptions(Options $optionsHelper)
    {
        $optionsHelper->delete('settings');
    }
}
