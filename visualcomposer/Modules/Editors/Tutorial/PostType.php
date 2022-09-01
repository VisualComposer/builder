<?php

namespace VisualComposer\Modules\Editors\Tutorial;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Frontend;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class PostType extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    protected $postType;

    protected $postNameSingular;

    protected $postNamePlural;

    public function __construct()
    {
        $this->postType = 'vcv_tutorials';
        $this->postNameSingular = __('Tutorial', 'visualcomposer');
        $this->postNamePlural = __('Tutorials', 'visualcomposer');

        $this->addEvent('vcv:inited', 'registerPostType');
        $this->wpAddAction('admin_init', 'doRedirect');
        $this->addFilter('vcv:frontend:url', 'addTypeToLink');
        $this->addFilter('vcv:helpers:access:editorPostType', 'addPostType');
        $this->wpAddFilter('bulk_actions-edit-' . $this->postType, 'removePostActions', 10, 1);
        $this->wpAddFilter('post_row_actions', 'updatePostEditBarLinks');
        $this->wpAddFilter('user_has_cap', 'removeCapabilites');
        $this->addEvent('vcv:inited', 'coreCapabilities');

        // Load Env Variables
        $this->addFilter(
            'vcv:editors:frontend:render',
            function ($response, Request $requestHelper, Frontend $frontendHelper) {
                if ($requestHelper->input('vcv-editor-type') === $this->postType && $frontendHelper->isFrontend()) {
                    $this->addFilter('vcv:editor:variables', 'addEditorTypeVariable');
                    $this->addFilter('vcv:editor:settings:pageTemplatesLayouts:current', 'setTemplateVariableBlank');
                }

                return $response;
            }
        );
    }

    /**
     * Create archive template post type
     *
     */
    protected function registerPostType()
    {
        register_post_type(
            $this->postType,
            [
                'labels' => [
                    'name' => $this->postNamePlural,
                    'singular_name' => $this->postNameSingular,
                    'menu_name' => $this->postNamePlural,
                    // translators: %s: Post type name.
                    'add_new' => sprintf(__('Add %s', 'visualcomposer'), $this->postNameSingular),
                    // translators: %s: Post type name.
                    'add_new_item' => sprintf(__('Add New %s', 'visualcomposer'), $this->postNameSingular),
                    'edit' => __('Edit', 'visualcomposer'),
                    // translators: %s: Post type name.
                    'edit_item' => sprintf(__('Edit %s', 'visualcomposer'), $this->postNameSingular),
                    // translators: %s: Post type name.
                    'new_item' => sprintf(__('New %s', 'visualcomposer'), $this->postNameSingular),
                    // translators: %s: Post type name.
                    'view' => sprintf(__('View %s', 'visualcomposer'), $this->postNamePlural),
                    // translators: %s: Post type name.
                    'view_item' => sprintf(__('View %s', 'visualcomposer'), $this->postNameSingular),
                    // translators: %s: Post type name.
                    'search_items' => sprintf(__('Search %s', 'visualcomposer'), $this->postNameSingular),
                    // translators: %s: Post type name.
                    'not_found' => sprintf(__('No %s Found', 'visualcomposer'), $this->postNamePlural),
                    'not_found_in_trash' => sprintf(
                    // translators: %s: Post type name.
                        __('No %s Found in Trash', 'visualcomposer'),
                        $this->postNamePlural
                    ),
                    // translators: %s: Post type name.
                    'parent' => sprintf(__('Parent %s', 'visualcomposer'), $this->postNameSingular),
                    // translators: %s: Post type name.
                    'filter_items_list' => sprintf(__('Filter %s', 'visualcomposer'), $this->postNamePlural),
                    // translators: %s: Post type name.
                    'items_list_navigation' => sprintf(__('%s Navigation', 'visualcomposer'), $this->postNamePlural),
                    // translators: %s: Post type name.
                    'items_list' => sprintf(__('%s List', 'visualcomposer'), $this->postNamePlural),
                ],
                'public' => false,
                'capability_type' => [$this->postType, $this->postType . 's'],
                'capabilities' => [
                    'edit_post' => 'edit_' . $this->postType,
                    'read_post' => 'read_' . $this->postType,
                    'delete_post' => 'delete_' . $this->postType,
                    'edit_posts' => 'edit_' . $this->postType . 's',
                    'edit_others_posts' => 'edit_others_' . $this->postType . 's',
                    'publish_posts' => 'publish_' . $this->postType . 's',
                    'read_private_posts' => 'read_private_' . $this->postType . 's',
                    'create_posts' => 'edit_' . $this->postType . 's',
                    'edit_published_posts' => 'edit_published_' . $this->postType . 's',
                    'delete_posts' => 'delete_' . $this->postType . 's',
                    'delete_private_posts' => 'delete_private_' . $this->postType . 's',
                    'delete_published_posts' => 'delete_published_' . $this->postType . 's',
                    'delete_others_posts' => 'delete_others_' . $this->postType . 's',
                    'read' => 'read_' . $this->postType,
                ],
                'publicly_queryable' => false,
                'exclude_from_search' => true,
                'show_ui' => true,
                'show_in_menu' => false,
                'hierarchical' => false,
                'taxonomies' => [],
                'has_archive' => false,
                'rewrite' => false,
                'query_var' => false,
                'show_in_nav_menus' => false,
            ]
        );
    }

    /**
     * Disable publish and create capabilities for tutorials
     *
     * @param $allcaps
     * @param $caps
     * @param $args
     * @param $user
     *
     * @return mixed
     */
    protected function removeCapabilites($allcaps, $caps, $args, $user)
    {
        $allcaps[ 'publish_' . $this->postType . 's' ] = false;
        $allcaps[ 'create_' . $this->postType . 's' ] = false;

        return $allcaps;
    }

    /**
     * Redirect to frontend editor
     *
     * @param \VisualComposer\Helpers\Request $requestHelper
     */
    protected function doRedirect(Request $requestHelper)
    {
        global $pagenow;
        if (
            ($pagenow === 'post-new.php' || ($pagenow === 'post.php' && $requestHelper->input('action') === 'edit'))
            && (
                $requestHelper->input('post_type') === $this->postType
                || get_post_type($requestHelper->input('post')) === $this->postType
            )
            && !$requestHelper->exists('vcv-action')
        ) {
            //redirect from classic editor to frontend editor
            if ($pagenow === 'post.php' && $requestHelper->input('post')) {
                $sourceId = $requestHelper->input('post');
                $attr = '?post=' . $sourceId . '&action=edit&vcv-source-id=' . $sourceId . '&';
                wp_safe_redirect(
                    admin_url(
                        $pagenow . $attr . 'post_type=' . rawurlencode($this->postType)
                        . '&vcv-action=frontend&vcv-editor-type='
                        . rawurlencode($this->postType)
                    )
                );
                exit;
            }
            wp_safe_redirect(
                add_query_arg(['vcv-action' => 'frontend', 'vcv-editor-type' => rawurlencode($this->postType)])
            );
            exit;
        }
    }

    /**
     * @param $url
     * @param $payload
     *
     * @return string
     */
    protected function addTypeToLink($url, $payload)
    {
        if ($this->postType === get_post_type($payload['sourceId'])) {
            return add_query_arg(['vcv-editor-type' => $this->postType], $url);
        }

        return $url;
    }

    /**
     * Add post type support for frontend editor
     *
     * @param $postTypes
     *
     * @return array
     */
    protected function addPostType($postTypes)
    {
        if (!in_array($this->postType, $postTypes, true)) {
            $postTypes[] = $this->postType;
        }

        return $postTypes;
    }

    /**
     * Remove edit action from dropdown
     *
     * @param $actions
     *
     * @return mixed
     */
    protected function removePostActions($actions)
    {
        global $post;

        // @codingStandardsIgnoreLine
        if (isset($post->post_type) && $post->post_type === $this->postType) {
            unset($actions['edit']);
        }

        return $actions;
    }

    /**
     * Update update post edit bar links
     *
     * @param $actions
     * @param $post
     *
     * @return mixed
     */
    protected function updatePostEditBarLinks(
        $actions,
        $post
    ) {
        // @codingStandardsIgnoreLine
        if ($post->post_type === $this->postType) {
            $templateType = get_post_meta($post->ID, '_vcv-type', true);
            unset($actions['inline hide-if-no-js'], $actions['edit'], $actions['view'], $actions['preview']);
            if (!in_array($templateType, ['', 'custom'])) {
                unset($actions['trash']);
            }
            $actions = array_reverse($actions);
        }

        return $actions;
    }

    /**
     * Add Post Type Capabilities to User Roles
     */
    protected function coreCapabilities()
    {
        $optionsHelper = vchelper('Options');

        // Capability migration for custom VC post types
        if (!$optionsHelper->get($this->postType . '-capability-migration-45')) {
            // @codingStandardsIgnoreStart
            global $wp_roles;
            $optionsHelper->delete($this->postType . '-capabilities-set');
            $wp_roles->remove_cap('contributor', 'read_' . $this->postType);
            $wp_roles->remove_cap('contributor', 'edit_' . $this->postType);
            $wp_roles->remove_cap('contributor', 'delete_' . $this->postType);
            $wp_roles->remove_cap('contributor', 'edit_' . $this->postType . 's');
            $wp_roles->remove_cap('contributor', 'delete_' . $this->postType . 's');
            $optionsHelper->set($this->postType . '-capability-migration-45', 1);
            // @codingStandardsIgnoreEnd
        }

        if ($optionsHelper->get($this->postType . '-capabilities-set')) {
            return;
        }

        $roles = ['administrator', 'editor', 'author',  'contributor'];

        foreach ($roles as $role) {
            $roleObject = get_role($role);
            if (!$roleObject) {
                continue;
            }

            $capabilities = [
                "read_{$this->postType}",
                "edit_{$this->postType}",
                "delete_{$this->postType}",
                "edit_{$this->postType}s",
                "delete_{$this->postType}s",
            ];

            if ($role === 'contributor') {
                $capabilities = [
                    "read_{$this->postType}",
                    "edit_{$this->postType}s",
                    "delete_{$this->postType}s",
                ];
            }

            if (in_array($role, ['administrator', 'editor', 'author'])) {
                $capabilities = array_merge(
                    $capabilities,
                    [
                        "delete_published_{$this->postType}s",
                        "edit_published_{$this->postType}s",
                    ]
                );
            }

            if (in_array($role, ['administrator', 'editor'])) {
                $capabilities = array_merge(
                    $capabilities,
                    [
                        "read_private_{$this->postType}s",
                        "edit_private_{$this->postType}s",
                        "delete_private_{$this->postType}s",
                        "delete_others_{$this->postType}s",
                        "delete_{$this->postType}",
                        "edit_others_{$this->postType}s",
                    ]
                );
            }

            if ($roleObject) {
                foreach ($capabilities as $cap) {
                    $roleObject->add_cap($cap);
                }

                $optionsHelper->set($this->postType . '-capabilities-set', 1);
            }
        }
        // reset current user all caps
        wp_get_current_user()->get_role_caps();
    }

    /**
     * @param $variables
     *
     * @return array
     */
    protected function addEditorTypeVariable($variables)
    {
        $editorType = false;
        $key = 'VCV_EDITOR_TYPE';
        foreach ($variables as $i => $variable) {
            if ($variable['key'] === $key) {
                $variables[ $i ] = [
                    'key' => $key,
                    'value' => $this->postType,
                    'type' => 'constant',
                ];
                $editorType = true;
            }
        }

        if (!$editorType) {
            $variables[] = [
                'key' => $key,
                'value' => $this->postType,
                'type' => 'constant',
            ];
        }

        return $variables;
    }

    /**
     * Set current layout variable as blank
     * @return array
     */
    protected function setTemplateVariableBlank()
    {
        return [
            'value' => 'blank',
            'type' => 'vc',
        ];
    }
}
