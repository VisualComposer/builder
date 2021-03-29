<?php

namespace VisualComposer\Modules\Settings\Pages;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Access\CurrentUser;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Modules\Settings\Traits\SubMenu;
use VisualComposer\Modules\Settings\Traits\Page;
use VisualComposer\Helpers\Traits\EventsFilters;

class RoleManager extends Container implements Module
{
    use Page;
    use SubMenu;
    use WpFiltersActions;
    use EventsFilters;

    /**
     * @var string
     */
    protected $slug = 'vcv-role-manager';

    /*
     * @var string
     */
    protected $templatePath = 'settings/pages/role-manager/role-manager.php';

    public function __construct()
    {
        $this->wpAddAction(
            'admin_menu',
            'addPage',
            9
        );

        $this->addFilter('vcv:ajax:settings:roles:save:adminNonce', 'saveRoles');

        $this->wpAddFilter('register_post_type_args', 'updateVcvPostTypes', 100, 2);

        // Default Fallback for rendering parts in role-manager page
        $this->addFilter(
            'vcv:render:settings:roleManager:part:*',
            function ($content, $payload) {
                if (empty($content)) {
                    $part = $payload['part'];
                    // TODO: Check if view exists to avoid warning
                    // Try to render from plugin
                    $content = vcview('settings/pages/role-manager/parts/' . str_replace('_', '-', $part), $payload);
                }

                return $content;
            },
            1000
        );
    }

    /**
     * @throws \Exception
     */
    protected function addPage()
    {
        $page = [
            'slug' => $this->slug,
            'title' => __('Role Manager', 'visualcomposer'),
            'layout' => 'dashboard-tab-content-standalone',
            'capability' => 'manage_options',
            'iconClass' => 'vcv-ui-icon-dashboard-lock',
            'isDashboardPage' => true,
        ];
        $this->addSubmenuPage($page, false);
    }

    /**
     * @return \WP_Roles
     */
    protected function getWpRoles()
    {
        global $wp_roles;
        if (function_exists('wp_roles')) {
            return $wp_roles;
        } else {
            if (!isset($wp_roles)) {
                // @codingStandardsIgnoreLine
                $wp_roles = new \WP_Roles();
            }
        }

        return $wp_roles;
    }

    /**
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\Access\CurrentUser $currentUserAccess
     *
     * @throws \Exception
     */
    protected function saveRoles($response, $payload, Request $requestHelper, CurrentUser $currentUserAccess)
    {
        //        $roles = $this->getWpRoles();
        //        $roles->use_db = true;
        //        // reset everything to default
        //        // Remove all role capabilities with vcv_*
        //        foreach ($roles->get_names() as $roleKey => $roleName) {
        //            $role = $roles->get_role($roleKey);
        //            if (!is_null($role)) {
        //                foreach ($role->capabilities as $capabilityKey => $value) {
        //                    if (strpos($capabilityKey, 'vcv_access_rules__') !== false) {
        //                        $role->remove_cap($capabilityKey);
        //                    }
        //                }
        //            }
        //        }
        //        die('RESET OK!');

        if ($currentUserAccess->can('manage_options')->get()) {
            $roles = $this->getWpRoles();
            $roles->use_db = true;
            //            if (
            //                vchelper('Request')->input('vcv-submitter') === 'remove_all_btn'
            //                || vchelper('Request')->input('vcv-submitter') === 'reset_btn'
            //            ) {
            //
            //            }

            // Remove all role capabilities with vcv_*
            foreach ($roles->get_names() as $roleKey => $roleName) {
                $role = $roles->get_role($roleKey);
                if (!is_null($role)) {
                    foreach ($role->capabilities as $capabilityKey => $value) {
                        if (strpos($capabilityKey, 'vcv_access_rules__') !== false) {
                            $role->remove_cap($capabilityKey);
                        }
                    }
                }
            }

            $roleCapabilities = (array)$requestHelper->input('vcv-role-manager');
            $roleAccessHelper = vchelper('AccessRole');
            // Save new capabilities
            foreach ($roleCapabilities as $roleKey => $partData) {
                foreach ($roleAccessHelper->getAvailableParts() as $part) {
                    if (isset($partData[ $part ])) {
                        if ($partData[ $part ] === 'on') {
                            $roleAccessHelper->who($roleKey)->part($part)->setState(true);
                        } elseif (is_array($partData[ $part ])) {
                            // It is multi-value capability like posts_*
                            foreach ($partData[ $part ] as $roleCap) {
                                $roleAccessHelper->who($roleKey)->part($part)->setCapRule($roleCap, true);
                            }
                        }
                    }
                }
            }
            echo 'OK!';
            exit;
        }

        header('Status: 403 Forbidden');
        header('HTTP/1.1 403 Forbidden');
        exit;
    }

    protected function updateVcvPostTypes($args, $postType)
    {
        if (strpos($postType, 'vcv_') !== false && !in_array($postType, ['vcv_presets', 'vcv_tutorials'])) {

            /// Only for vcv_headers, vcv_footer, vcv_sidebars
            ///
            if (in_array($postType, ['vcv_headers', 'vcv_footers', 'vcv_sidebars', 'vcv_archives', 'vcv_layouts'])) {
                $args['capabilities'] = [
                    'edit_post' => 'vcv_access_rules__post_type_' . $postType,
                    'read_post' => 'vcv_access_rules__dashboard_addon_theme_builder',
                    'delete_post' => 'vcv_access_rules__dashboard_addon_theme_builder',
                    'edit_posts' => 'vcv_access_rules__dashboard_addon_theme_builder',
                    'edit_others_posts' => 'vcv_access_rules__dashboard_addon_theme_builder',
                    'publish_posts' => 'vcv_access_rules__dashboard_addon_theme_builder',
                    'create_posts' => 'vcv_access_rules__dashboard_addon_theme_builder',
                    'edit_published_posts' => 'vcv_access_rules__dashboard_addon_theme_builder',
                    'delete_posts' => 'vcv_access_rules__dashboard_addon_theme_builder',
                    'delete_published_posts' => 'vcv_access_rules__dashboard_addon_theme_builder',
                    'delete_others_posts' => 'vcv_access_rules__dashboard_addon_theme_builder',
                    'read' => 'vcv_access_rules__dashboard_addon_theme_builder',
                ];
            }
            if (in_array($postType, ['vcv_templates'])) {
                $args['capabilities'] = [
                    'edit_post' => 'vcv_access_rules__dashboard_addon_global_templates',
                    'read_post' => 'vcv_access_rules__dashboard_addon_global_templates',
                    'delete_post' => 'vcv_access_rules__dashboard_addon_global_templates',
                    'edit_posts' => 'vcv_access_rules__dashboard_addon_global_templates',
                    'edit_others_posts' => 'vcv_access_rules__dashboard_addon_global_templates',
                    'publish_posts' => 'vcv_access_rules__dashboard_addon_global_templates',
                    'create_posts' => 'vcv_access_rules__dashboard_addon_global_templates',
                    'edit_published_posts' => 'vcv_access_rules__dashboard_addon_global_templates',
                    'delete_posts' => 'vcv_access_rules__dashboard_addon_global_templates',
                    'delete_published_posts' => 'vcv_access_rules__dashboard_addon_global_templates',
                    'delete_others_posts' => 'vcv_access_rules__dashboard_addon_global_templates',
                    'read' => 'vcv_access_rules__dashboard_addon_global_templates',
                ];
            }
            if (in_array($postType, ['vcv_popups'])) {
                $args['capabilities'] = [
                    'edit_post' => 'vcv_access_rules__dashboard_addon_popup_builder',
                    'read_post' => 'vcv_access_rules__dashboard_addon_popup_builder',
                    'delete_post' => 'vcv_access_rules__dashboard_addon_popup_builder',
                    'edit_posts' => 'vcv_access_rules__dashboard_addon_popup_builder',
                    'edit_others_posts' => 'vcv_access_rules__dashboard_addon_popup_builder',
                    'publish_posts' => 'vcv_access_rules__dashboard_addon_popup_builder',
                    'create_posts' => 'vcv_access_rules__dashboard_addon_popup_builder',
                    'edit_published_posts' => 'vcv_access_rules__dashboard_addon_popup_builder',
                    'delete_posts' => 'vcv_access_rules__dashboard_addon_popup_builder',
                    'delete_published_posts' => 'vcv_access_rules__dashboard_addon_popup_builder',
                    'delete_others_posts' => 'vcv_access_rules__dashboard_addon_popup_builder',
                    'read' => 'vcv_access_rules__dashboard_addon_popup_builder',
                ];
            }

            //            // Only for vcv_templates
            //            $args['capabilities'] = [
            //                'edit_post' => 'vcv_access_rules__post_types_edit_global_templates',
            //                'read_post' => 'vcv_access_rules__post_types_edit_global_templates',
            //                'delete_post' => 'vcv_access_rules__post_types_edit_global_templates',
            //                'edit_posts' => 'vcv_access_rules__post_types_edit_global_templates',
            //                'edit_others_posts' => 'vcv_access_rules__post_types_edit_global_templates',
            //                'publish_posts' => 'vcv_access_rules__post_types_edit_global_templates',
            //                'create_posts' => 'vcv_access_rules__post_types_edit_global_templates',
            //                'edit_published_posts' => 'vcv_access_rules__post_types_edit_global_templates',
            //                'delete_posts' => 'vcv_access_rules__post_types_edit_global_templates',
            //                'delete_published_posts' => 'vcv_access_rules__post_types_edit_global_templates',
            //                'delete_others_posts' => 'vcv_access_rules__post_types_edit_global_templates',
            //                'read' => 'vcv_access_rules__post_types_edit_global_templates',
            //            ];
            //            // Only for vcv_popups
            //            $args['capabilities'] = [
            //                'edit_post' => 'vcv_access_rules__post_types_edit_popup_builder',
            //                'read_post' => 'vcv_access_rules__post_types_edit_popup_builder',
            //                'delete_post' => 'vcv_access_rules__post_types_edit_popup_builder',
            //                'edit_posts' => 'vcv_access_rules__post_types_edit_popup_builder',
            //                'edit_others_posts' => 'vcv_access_rules__post_types_edit_popup_builder',
            //                'publish_posts' => 'vcv_access_rules__post_types_edit_popup_builder',
            //                'create_posts' => 'vcv_access_rules__post_types_edit_popup_builder',
            //                'edit_published_posts' => 'vcv_access_rules__post_types_edit_popup_builder',
            //                'delete_posts' => 'vcv_access_rules__post_types_edit_popup_builder',
            //                'delete_published_posts' => 'vcv_access_rules__post_types_edit_popup_builder',
            //                'delete_others_posts' => 'vcv_access_rules__post_types_edit_popup_builder',
            //                'read' => 'vcv_access_rules__post_types_edit_popup_builder',
            //            ];
        }

        return $args;
    }
}
