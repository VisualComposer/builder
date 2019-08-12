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
use VisualComposer\Helpers\Gutenberg;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Modules\Settings\Traits\Fields;
use VisualComposer\Helpers\Request;

class GutenbergAttributeController extends Container implements Module
{
    protected $postTypeSlug = 'vcv_gutenberg_attr';

    protected $removeGutenberg = null;

    protected $printed = false;

    use WpFiltersActions;
    use EventsFilters;
    use Fields;

    public function __construct()
    {
        $this->addEvent('vcv:system:activation:hook', 'setGutenbergEditor');
        $this->wpAddAction('init', 'initialize');
        $this->addFilter('vcv:frontend:content vcv:frontend:content:encode', 'doGutenbergBlocks');

        $this->optionGroup = 'vcv-settings';
        $this->optionSlug = 'vcv-gutenberg-editor';

        //$this->addFilter('vcv:helpers:settingsDefault', 'defaultSettings');
        /**
         * @see  \VisualComposer\Modules\Vendors\GutenbergAttributeController::buildPage
         */
        $this->wpAddAction(
            'admin_init',
            'buildPage',
            11
        );

        $this->addEvent('vcv:system:factory:reset', 'unsetOptions');
    }

    protected function doGutenbergBlocks($content, $payload)
    {
        if (function_exists('do_blocks')) {
            $content = do_blocks($content);
        }

        return $content;
    }

    protected function buildPage(CurrentUser $currentUserAccess)
    {
        if (!function_exists('the_gutenberg_project') && !function_exists('use_block_editor_for_post')) {
            return;
        }
        if (!$currentUserAccess->wpAll('edit_posts')->get()) {
            return;
        }

        $this->call('disableGutenberg');

        $this->call('setEditor');

        $this->wpAddAction('admin_print_scripts', 'outputGutenberg');

        $showSettings = true;
        if (function_exists('classic_editor_init_actions')) {
            if (get_option('classic-editor-replace') !== 'no-replace') {
                $showSettings = false;
            }
        }

        if ($showSettings) {
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
                    'page' => 'vcv-settings',
                    'callback' => $sectionCallback,
                ]
            );

            $fieldCallback = function () {
                /**
                 * @see \VisualComposer\Modules\Vendors\GutenbergAttributeController::renderToggle
                 */
                echo $this->call('renderToggle', ['value' => 'gutenberg-editor']);
            };

            $this->addField(
                [
                    'page' => 'vcv-settings',
                    'title' => __('Gutenberg', 'vcwb'),
                    'name' => 'settings',
                    'id' => 'vcv-settings-gutenberg-editor',
                    'fieldCallback' => $fieldCallback,
                ]
            );
        }
    }

    /**
     * @param $value
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return mixed|string
     */
    protected function renderToggle($value, Options $optionsHelper)
    {
        return vcview(
            'settings/option-toggle',
            [
                'value' => $value,
                'enabledOptions' => (array)$optionsHelper->get('settings', ['gutenberg-editor']),
            ]
        );
    }

    protected function setGutenbergEditor(Options $optionsHelper)
    {
        $settings = $optionsHelper->get('settings', ['gutenberg-editor']);
        $optionsHelper->set('settings', $settings);
    }

    /**
     * Disable the gutenberg
     *
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @throws \ReflectionException
     */
    protected function disableGutenberg(Options $optionsHelper, Request $requestHelper)
    {
        $settings = $optionsHelper->get('settings', ['gutenberg-editor']);
        $savedEditor = get_post_meta($requestHelper->input('post'), VCV_PREFIX . 'be-editor', true);
        if ((
                $requestHelper->input('vcv-set-editor') === 'gutenberg'
                && !$requestHelper->exists('classic-editor')
                && (
                    !empty($settings) && in_array('gutenberg-editor', $settings)
                )
            )
            || (!$requestHelper->exists('classic-editor') && !$this->isVcwbPage() && !empty($settings)
                && in_array(
                    'gutenberg-editor',
                    $settings
                ))
            || ($savedEditor === 'gutenberg' && !empty($settings) && in_array('gutenberg-editor', $settings))
            || ($requestHelper->exists('classic-editor__forget'))
        ) {
            return;
        }

        if (function_exists('use_block_editor_for_post')) {
            $this->removeGutenberg = $this->wpAddFilter('use_block_editor_for_post', '__return_false');
        } elseif (function_exists('the_gutenberg_project')) {
            $this->removeGutenberg = $this->wpAddFilter('gutenberg_can_edit_post_type', '__return_false');
        }
    }

    /**
     * Check if page build by VCWB
     *
     * @return bool
     * @throws \ReflectionException
     */
    protected function isVcwbPage()
    {
        $sourceId = get_the_ID();
        if (!$sourceId) {
            $requestHelper = vchelper('Request');
            $sourceId = $requestHelper->input('post');
        }

        $postContent = get_post_meta($sourceId, VCV_PREFIX . 'pageContent', true);
        if (!empty($postContent) && !$this->call('overrideDisableGutenberg', ['sourceId' => $sourceId])) {
            return true;
        }

        return false;
    }

    /**
     * Set editor to gutenberg, handled by vcv-set-editor parameter
     *
     * @param \VisualComposer\Helpers\Request $requestHelper
     */
    protected function setEditor(Request $requestHelper)
    {
        if ($requestHelper->exists(VCV_PREFIX . 'set-editor')) {
            /**
             * @var \WP_Post $post
             */
            $post = get_post(get_the_ID());
            $editor = $requestHelper->input(VCV_PREFIX . 'set-editor');
            if ($post && $editor) {
                update_post_meta($post->ID, VCV_PREFIX . 'be-editor', $editor);
                $protocol = ((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off')
                    || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
                $url = $protocol . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
                $url = remove_query_arg(VCV_PREFIX . 'set-editor', $url);
                wp_redirect($url);
            }
        }
    }

    protected function initialize()
    {
        global $pagenow;
        $requestHelper = vchelper('Request');
        $currentUserAccessHelper = vchelper('AccessCurrentUser');
        if ('post-new.php' === $pagenow
            && $currentUserAccessHelper->wpAll(
                'edit_posts'
            )->get()
            && $requestHelper->input('post_type') === $this->postTypeSlug
        ) {
            $this->registerGutenbergAttributeType();
            $this->wpAddAction('add_meta_boxes', 'removeUiMetaboxes', 100);
            $this->wpAddAction('admin_print_styles', 'removeAdminUi');
            // @codingStandardsIgnoreStart
            global $wp_version;
            $wpVersion = $wp_version;
            // @codingStandardsIgnoreEnd
            if (version_compare($wpVersion, '4.9.8', '<=') && function_exists('the_gutenberg_project')) {
                $this->wpAddFilter('replace_editor', 'getGutenberg', 9, 2);
            }
            // Always enable the gutenberg block editor through vcwb editor
            $this->wpAddFilter('use_block_editor_for_post', '__return_true');
            $this->wpAddFilter('gutenberg_can_edit_post_type', '__return_true');
        }
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
            'public' => true,
            'publicly_queryable' => true,
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
        if ($this->removeGutenberg) {
            $this->wpRemoveFilter('gutenberg_can_edit_post_type', $this->removeGutenberg);
            $this->wpRemoveFilter('use_block_editor_for_post', $this->removeGutenberg);
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

            .edit-post-sidebar .components-panel > :not(.edit-post-settings-sidebar__panel-block) {
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
        include_once ABSPATH . 'wp-admin/admin-header.php';
        the_gutenberg_project();
    }

    /**
     * To override the disabled gutenberg setting
     *
     * @param $sourceId
     *
     * @return bool
     */
    protected function overrideDisableGutenberg($sourceId)
    {
        if (!$sourceId) {
            $sourceId = get_the_ID();
        }
        $isoverrideDisableGutenberg = get_post_meta($sourceId, VCV_PREFIX . 'be-editor', true);
        if ($isoverrideDisableGutenberg === 'gutenberg') {
            return true;
        }

        return false;
    }

    protected function removeUiMetaboxes()
    {
        // @codingStandardsIgnoreStart
        global $wp_meta_boxes;
        $wp_meta_boxes = [
            'vcv_gutenberg_attr' => [
                'normal' => [
                    'core' => [],
                ],
            ],
        ];
        // @codingStandardsIgnoreEnd
    }

    protected function unsetOptions(Options $optionsHelper)
    {
        $optionsHelper->delete('settings');
    }

    /**
     * Output global variables
     *
     * @param \VisualComposer\Helpers\Options $optionsHelper
     * @param \VisualComposer\Helpers\Request $requestHelper
     */
    protected function outputGutenberg(Options $optionsHelper, Request $requestHelper, Gutenberg $gutenbergHelper)
    {
        if ($this->printed) {
            return;
        }

        $available = false;
        if ($gutenbergHelper->isGutenbergAvailable()) {
            $available = true;
        }
        evcview(
            'partials/constant-script',
            [
                'key' => 'VCV_GUTENBERG',
                'value' => $available,
                'type' => 'constant',
            ]
        );
        $this->printed = true;
    }
}
