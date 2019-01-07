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
use VisualComposer\Helpers\Token;

class WpbakeryController extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    protected $postTypeSlug = 'vcv-wpb-attribute';

    public function __construct()
    {
        $this->wpAddAction('init', 'initialize');
        $this->wpAddAction('admin_init', 'adminInitialize', 100);
        $this->addFilter('vcv:helpers:localizations:i18n', 'addI18n');
    }

    protected function initialize()
    {
        $this->addFilter('vcv:editor:variables', 'outputWpbakery');

        if (!defined('WPB_VC_VERSION')) {
            return;
        }

        $this->wpAddFilter(
            'vc_is_valid_post_type_be',
            'disableWpbakery'
        );

        $this->wpAddFilter(
            'page_row_actions',
            'hideWpbakeryActions'
        );

        $this->wpAddFilter(
            'post_row_actions',
            'hideWpbakeryActions'
        );

        $this->wpAddFilter(
            'admin_bar_menu',
            'hideWpbakeryAdminBarLink',
            1001
        );
    }

    protected function adminInitialize()
    {
        global $pagenow;

        if (!defined('WPB_VC_VERSION')) {
            return;
        }
        $requestHelper = vchelper('Request');
        $currentUserAccessHelper = vchelper('AccessCurrentUser');
        $canAccess = $currentUserAccessHelper->wpAll('edit_posts')->get();
        $isAjax = defined('DOING_AJAX') ? DOING_AJAX : false;
        if ($canAccess && ($isAjax || $requestHelper->input('post_type') === $this->postTypeSlug)) {
            $this->registerAttributeType();
        }
        if ('post-new.php' === $pagenow
            && $canAccess
            && $requestHelper->input('post_type') === $this->postTypeSlug
        ) {
            $this->wpAddAction('admin_print_styles', 'removeAdminUi');
            // Always disable the gutenberg block editor through vcwb editor in WPB attribute
            $this->wpAddFilter('use_block_editor_for_post', '__return_false');
            $this->wpAddFilter('vc_check_post_type_validation', '__return_true');
            $this->wpAddFilter('gutenberg_can_edit_post_type', '__return_false');

            // Enable WPB by default
            add_filter(
                'vc_role_access_with_backend_editor_get_state',
                function () {
                    return 'default';
                }
            );

            // Allow WPB for wpb post type always
            $this->wpAddFilter(
                'vc_is_valid_post_type_be',
                function ($result, $type) {
                    if ($type === $this->postTypeSlug) {
                        return true;
                    }

                    return $result;
                }
            );
            // Remove stuffs
            $this->wpAddAction('add_meta_boxes', 'removeUiMetaboxes', 100);
        }
    }

    protected function removeUiMetaboxes()
    {
        // @codingStandardsIgnoreStart
        global $wp_meta_boxes;
        // Remove ALL meta boxes except WPB
        if (isset($wp_meta_boxes['vcv-wpb-attribute'], $wp_meta_boxes['vcv-wpb-attribute']['normal'], $wp_meta_boxes['vcv-wpb-attribute']['normal']['high'], $wp_meta_boxes['vcv-wpb-attribute']['normal']['high']['wpb_visual_composer'])) {
            $wpbMeta = $wp_meta_boxes['vcv-wpb-attribute']['normal']['high']['wpb_visual_composer'];
            $wp_meta_boxes = [
                'vcv-wpb-attribute' => [
                    'normal' => [
                        'high' => ['wpb_visual_composer' => $wpbMeta],
                    ],
                ],
            ];
        } else {
            $wp_meta_boxes = [];
        }
        // @codingStandardsIgnoreEnd
    }

    protected function registerAttributeType()
    {
        $labels = [
            'name' => _x('WPB attrs', 'Post type general name', 'vcwb'),
            'singular_name' => _x('WPB attr', 'Post type singular name', 'vcwb'),
            'menu_name' => _x('WPB attrs', 'Admin Menu text', 'vcwb'),
            'name_admin_bar' => _x('WPB attr', 'Add New on Toolbar', 'vcwb'),
            'add_new' => __('Add New', 'vcwb'),
            'add_new_item' => __('Add New WPB attr', 'vcwb'),
            'new_item' => __('New WPB attr', 'vcwb'),
            'edit_item' => __('Edit WPB attr', 'vcwb'),
            'view_item' => __('View WPB attr', 'vcwb'),
            'all_items' => __('All WPB attrs', 'vcwb'),
            'search_items' => __('Search WPB attrs', 'vcwb'),
            'parent_item_colon' => __('Parent WPB attrs:', 'vcwb'),
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
            'show_in_rest' => false,
            'supports' => ['editor'],
        ];
        register_post_type($this->postTypeSlug, $args);
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

            #wpbody-content, #wpfooter {
                opacity: 0;
            }

            .vc_ui-panel-header-controls > :not([data-vc-ui-element="button-close"]) {
                /*display: none !important;*/
            }

            .vc_ui-panel-header-controls > [data-vc-ui-element="settings-dropdown"] {
                display: none !important;
            }

            .post-type-vcv-wpb-attribute .ui-resizable-handle {
                display: none !important;
            }

            .post-type-vcv-wpb-attribute .vc_ui-panel-window {
                padding: 0 !important;
            }

            @media (max-width: 767px) {
                .post-type-vcv-wpb-attribute.vc_ui-panel-window {
                    padding: 0 !important;
                }
            }

            .post-type-vcv-wpb-attribute .vc_ui-panel-window {
                width: 100% !important;
                height: 100% !important;
                padding: 0 !important;
                max-height: inherit !important;
                top: 0 !important;
                left: 0 !important;
            }

            body {
                overflow: hidden;
            }

            @media (max-width: 767px) {
                .post-type-vcv-wpb-attribute .vc_ui-panel-window.vc_active {
                    display: flex !important; /** Override **/
                }
            }
        </style>
        <script>
          window.vc_api_version = <?php echo (int)$this->getApiVersion(); ?>;
        </script>
        <?php
    }

    protected function getApiVersion()
    {
        // Related to ifrWin.vc.storage.parseContent({}, this.state.value)
        $compare = version_compare(WPB_VC_VERSION, '5.5', '<');

        return $compare ? 1 : 2;
    }

    protected function disableWpbakery($isValid)
    {
        $sourceId = get_the_ID();
        $postContent = get_post_meta($sourceId, VCV_PREFIX . 'pageContent', true);
        if (!empty($postContent)) {
            return false;
        }

        return $isValid;
    }

    protected function hideWpbakeryActions($actions)
    {
        $post = get_post();
        $sourceId = $post->ID;
        $postContent = get_post_meta($sourceId, VCV_PREFIX . 'pageContent', true);
        if (!empty($postContent)) {
            unset($actions['edit_vc']);
        }

        return $actions;
    }

    protected function hideWpbakeryAdminBarLink($wpAdminBar)
    {
        if (!is_object($wpAdminBar)) {
            // @codingStandardsIgnoreStart
            global $wp_admin_bar;
            $wpAdminBar = $wp_admin_bar;
            // @codingStandardsIgnoreEnd
        }

        if (is_singular()) {
            $sourceId = get_the_ID();
            $postContent = get_post_meta($sourceId, VCV_PREFIX . 'pageContent', true);
            if (!empty($postContent)) {
                $id = 'vc_inline-admin-bar-link';
                /** @var $wpAdminBar \WP_Admin_Bar */
                $wpAdminBar->remove_node($id);
            }
        }
    }

    protected function outputWpbakery($variables, Token $tokenHelper)
    {
        if (defined('WPB_VC_VERSION')) {
            $variables[] = [
                'key' => 'VCV_WPBAKERY_ACTIVE',
                'value' => true,
                'type' => 'constant',
            ];

            $variables[] = [
                'key' => 'VCV_WPBAKERY_EDIT_FORM_URL',
                'value' => set_url_scheme(admin_url('post-new.php?post_type=vcv-wpb-attribute')),
                'type' => 'constant',
            ];

            $variables[] = [
                'key' => 'VCV_WPBAKERY_ALLOW_MIGRATION',
                'value' => version_compare(WPB_VC_VERSION, '5.0', '>='),
                'type' => 'constant',
            ];
        }

        $variables[] = [
            'key' => 'VCV_WPBAKERY_PLUGINS_URL',
            'value' => (is_multisite()) ? network_admin_url('plugins.php') : admin_url('plugins.php'),
            'type' => 'constant',
        ];

        $variables[] = [
            'key' => 'VCV_WPBAKERY_HUB_ACCESS',
            'value' => $tokenHelper->isSiteAuthorized(),
            'type' => 'constant',
        ];

        $variables[] = [
            'key' => 'VCV_WPBAKERY_ACTIVATE_URL',
            'value' => esc_url(admin_url('admin.php?page=vcv-go-premium&vcv-ref=plugins-page')),
            'type' => 'constant',
        ];

        return $variables;
    }

    protected function addI18n($locale)
    {
        $locale['addonWpbMigration_minRequirement'] = __('WPBakery Page Builder version is 5.0 or newer', 'vcwb');
        if (defined('WPB_VC_VERSION')) {
            $locale['addonWpbMigration_minRequirementFail'] = sprintf(
                __('WPBakery Page Builder version is 5.0 or newer - your version is %s', 'vcwb'),
                WPB_VC_VERSION
            );
            $locale['addonWpbMigration_minRequirementFailAction'] = __('please update', 'vcwb');
        }
        $locale['addonWpbMigration_authorize'] = __(
            'Visual Composer Hub access to download migration add-on - Free or Premium',
            'vcwb'
        );
        $locale['addonWpbMigration_unlockHub'] = __('Unlock Visual Composer Hub', 'vcwb');

        return $locale;
    }
}
