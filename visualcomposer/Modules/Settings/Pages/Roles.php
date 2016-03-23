<?php

namespace VisualComposer\Modules\Settings\Pages;

use VisualComposer\Helpers\Generic\Request;
use VisualComposer\Helpers\Generic\Access\Role\Access;
use VisualComposer\Framework\Container;

/**
 * Class Roles
 * @package VisualComposer\Modules\Settings\Pages
 */
class Roles extends Container
{
    use Page;
    /**
     * @var string
     */
    protected $slug = 'vc-v-roles';
    protected $templatePath = 'settings/pages/roles/index';
    /**
     * @var bool
     */
    protected $postTypes = false;
    /**
     * @var bool
     */
    protected $excludedPostTypes = false;
    /**
     * @var array
     */
    protected $parts = [
        'post_types',
        'backend_editor',
        'frontend_editor',
        'post_settings',
        'settings',
        'templates',
        //'shortcodes',
        //'grid_builder',
        //'presets',
    ];

    /**
     * Roles constructor.
     */
    public function __construct()
    {
        add_filter(
            'vc:v:settings:getPages',
            function ($pages) {
                return $this->call('addPage', [$pages]);
            }
        );

        add_action(
            'wp_ajax_vc_roles_settings_save',
            function () {
                $this->call('saveSettings');
            }
        );
    }

    /**
     * @param array $pages
     *
     * @return array
     */
    private function addPage($pages)
    {
        $pages[] = [
            'slug' => $this->getSlug(),
            'title' => __('Role Manager', 'vc5'),
            'controller' => $this,
        ];

        return $pages;
    }

    /**
     * Get list of parts
     *
     * @return mixed|void
     */
    public function getParts()
    {
        return apply_filters('vc:v:settings:pages:roles:getParts', $this->parts);
    }

    /**
     * Check required capability for this role to have user access.
     *
     * @param $part
     *
     * @return array
     */
    public function getPartCapability($part)
    {
        return 'settings' !== $part ? [
            'edit_posts',
            'edit_pages',
        ] : 'manage_options';
    }

    /**
     * @param $role
     * @param $caps
     * @return bool
     */
    public function hasRoleCapability($role, $caps)
    {
        $has = false;
        $wpRole = get_role($role);
        if (is_string($caps)) {
            $has = $wpRole->has_cap($caps);
        } elseif (is_array($caps)) {
            $i = 0;
            while (false === $has && $i < count($caps)) {
                $has = $this->hasRoleCapability($role, $caps[ $i++ ]);
            }
        }

        return $has;
    }

    /**
     * @return \WP_Roles
     */
    public function getWpRoles()
    {
        global $wp_roles;
        if (function_exists('wp_roles')) {
            return $wp_roles;
        } else {
            if (!isset($wp_roles)) {
                $wp_roles = new \WP_Roles();
            }
        }

        return $wp_roles;
    }

    /**
     * @param \VisualComposer\Helpers\Generic\Access\Role\Access $roleAccess
     * @param array $params
     * @return array
     */
    public function save(Access $roleAccess, $params = [])
    {
        $data = ['message' => ''];
        $roles = $this->getWpRoles();
        $editableRoles = get_editable_roles();
        foreach ($params as $role => $parts) {
            if (is_string($parts)) {
                $parts = json_decode(stripslashes($parts), true);
            }
            if (isset($editableRoles[ $role ])) {
                foreach ($parts as $part => $settings) {
                    $this->parseRole($roleAccess, $role, $part, $roles, $settings);
                }
            }
        }
        $data['message'] = __('Roles settings successfully saved.', 'vc5');

        return $data;
    }

    /**
     * @return array|bool
     */
    public function getPostTypes()
    {
        if (false === $this->postTypes) {
            $this->postTypes = [];
            $excluded = $this->getExcludedPostTypes();
            foreach (get_post_types(['public' => true]) as $postType) {
                if (!in_array($postType, $excluded)) {
                    $this->postTypes[] = [
                        $postType,
                        $postType,
                    ];
                }
            }
        }

        return $this->postTypes;
    }

    /**
     * @return array
     */
    public function getExcludedPostTypes()
    {
        if (false === $this->excludedPostTypes) {
            $this->excludedPostTypes = apply_filters(
                'vc:v:settings:pages:roles:getExcludedPostTypes',
                [
                    'attachment',
                    'revision',
                    'nav_menu_item',
                    'mediapage',
                ]
            );
        }

        return $this->excludedPostTypes;
    }

    /**
     * Save roles
     *
     * @param Request $request
     * @param Access $roleAccess
     */
    public function saveSettings(Request $request, Access $roleAccess)
    {
        $field = 'vc_settings-' . $this->getSlug() . '-action';

        if (check_admin_referer($field, 'vc_nonce_field') && current_user_can('manage_options')) {
            $data = $this->save($request->input('vc_roles', []), $roleAccess);
            wp_send_json($data);
        }
    }

    /**
     * @param \VisualComposer\Helpers\Generic\Access\Role\Access $roleAccess
     * @param $role
     * @param $part
     * @param $roles
     * @param $settings
     */
    private function parseRole(Access $roleAccess, $role, $part, $roles, $settings)
    {
        $partKey = $roleAccess->who($role)->part($part)->getStateKey();
        $stateValue = '0';
        $roles->use_db = false; // Disable saving in DB on every cap change
        foreach ($settings as $key => $value) {
            if ('_state' === $key) {
                $stateValue = in_array(
                    $value,
                    [
                        '0',
                        '1',
                    ]
                ) ? (boolean)$value : $value;
            } else {
                if (empty($value)) {
                    $roles->remove_cap($role, $partKey . '/' . $key);
                } else {
                    $roles->add_cap($role, $partKey . '/' . $key, true);
                }
            }
        }
        $roles->use_db = true; //  Enable for the lat change in cap of role to store data in DB
        $roles->add_cap($role, $partKey, $stateValue);
    }
}
