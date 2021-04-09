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

        // Default Fallback for rendering parts in role-manager page
        $this->addFilter(
            'vcv:render:settings:roleManager:part:*',
            function ($content, $payload) {
                if (empty($content)) {
                    $part = $payload['part'];
                    // Try to render from plugin
                    $content = vcview('settings/pages/role-manager/parts/' . str_replace('_', '-', $part), $payload);
                }

                return $content;
            },
            1000
        );

        $this->wpAddFilter('user_has_cap', 'addRoleManagerCaps');
    }

    protected function addRoleManagerCaps($allcaps, $caps, $args, $user)
    {
        // Must have ALL requested caps.
        if (array_key_exists('administrator', $allcaps)) {
            foreach ((array)$caps as $cap) {
                if (strpos($cap, 'vcv_access_rules__') !== false && strpos($cap, 'vcv_access_rules__post_types') === false && empty($allcaps[ $cap ])) {
                    $allcaps[ $cap ] = true;
                }
            }
        }

        return $allcaps;
    }

    /**
     * @throws \Exception
     */
    protected function addPage()
    {
        $page = [
            'slug' => $this->slug,
            'title' => __('Role Manager', 'visualcomposer'),
            'description' => __('Manage WordPress user role access rights for all Visual Composer features. Select predefined configurations or customize access rights for any user role.', 'visualcomposer'),
            'layout' => 'dashboard-tab-content-standalone',
            'capability' => 'manage_options',
            'iconClass' => 'vcv-ui-icon-dashboard-lock',
            'isDashboardPage' => true,
            'premiumTitle' => __('PREMIUM ROLE MANAGER', 'visualcomposer'),
            'premiumDescription' => __('Control feature access for certain user roles. Lock functionality, restrict elements, and more.', 'visualcomposer'),
            'premiumUrl' => vchelper('Utm')->get('vcdashboard-teaser-rolemanager'),
            'premiumActionBundle' => 'roleManager',
        ];
        $this->addSubmenuPage($page, false);
    }

    /**
     * @return \WP_Roles
     */
    protected function getWpRoles()
    {
        // @codingStandardsIgnoreLine
        global $wp_roles;
        if (function_exists('wp_roles')) {
            // @codingStandardsIgnoreLine
            return $wp_roles;
        }

        // @codingStandardsIgnoreLine
        if (!isset($wp_roles)) {
            // @codingStandardsIgnoreLine
            $wp_roles = new \WP_Roles();
        }

        // @codingStandardsIgnoreLine
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
        if ($currentUserAccess->wpAll('manage_options')->get()) {
            $roles = $this->getWpRoles();
            // @codingStandardsIgnoreLine
            $roles->use_db = true;

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
                $this->updatePartsLoop($roleAccessHelper, $partData, $roleKey);
            }
            echo 'OK!';
            exit;
        }

        header('Status: 403 Forbidden');
        header('HTTP/1.1 403 Forbidden');
        exit;
    }

    /**
     * @param mixed $partData
     * @param mixed $part
     * @param mixed $roleAccessHelper
     * @param int|string $roleKey
     */
    protected function updatePart($partData, $part, $roleAccessHelper, $roleKey)
    {
        if ($partData === 'on') {
            $roleAccessHelper->who($roleKey)->part($part)->setState(true);
        } elseif (is_array($partData)) {
            // It is multi-value capability like posts_*
            foreach ($partData[$part] as $roleCap) {
                $roleAccessHelper->who($roleKey)->part($part)->setCapRule($roleCap, true);
            }
        }
    }

    /**
     * @param mixed $roleAccessHelper
     * @param mixed $partData
     * @param int|string $roleKey
     */
    protected function updatePartsLoop($roleAccessHelper, $partData, $roleKey)
    {
        foreach ($roleAccessHelper->getAvailableParts() as $part) {
            if (isset($partData[ $part ])) {
                $this->updatePart($partData, $part, $roleAccessHelper, $roleKey);
            }
        }
    }
}
