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
use VisualComposer\Helpers\Options;
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
            20
        );

        $this->addFilter('vcv:ajax:settings:roles:save:adminNonce', 'saveRoles');
        $this->addFilter('vcv:wp:dashboard:variables', 'addVariables');
        $this->addFilter('vcv:helper:access:role:defaultCapabilities', 'addDefaultCapability');
        $this->wpAddFilter('role_has_cap', 'checkPresetUpdate');

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

        $this->addFilter('vcv:render:settings:roleManager:rolePreset', 'changeRolePreset');
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
            'description' => __(
                'Use these settings to control which Visual Composer features each user role can access. These changes doesn\'t affect default WordPress capabilities.',
                'visualcomposer'
            ),
            'layout' => 'dashboard-tab-content-standalone',
            'capability' => 'manage_options',
            'iconClass' => 'vcv-ui-icon-dashboard-lock',
            'isDashboardPage' => true,
            'premiumTitle' => __('PREMIUM ROLE MANAGER', 'visualcomposer'),
            'premiumDescription' => __('Control feature access for certain user roles. Lock functionality, restrict elements, and more.', 'visualcomposer'),
            'premiumUrl' => vchelper('Utm')->get('vcdashboard-teaser-rolemanager'),
            'activationUrl' => vchelper('Utm')->getActivationUrl('rolemanager-vcdashboard'),
            'premiumActionBundle' => 'roleManager',
        ];
        $this->addSubmenuPage($page, false);
    }

    /**
     * @return \WP_Roles
     */
    protected function getWpRoles()
    {
        $globalsHelper = vchelper('Globals');
        $roles = $globalsHelper->get('wp_roles');
        if (empty($roles)) {
            $roles = new \WP_Roles();
            $globalsHelper->set('wp_roles', $roles);
        }

        return $roles;
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
            $rolePresets = (array)$requestHelper->input('vcv-settings-role-preset');
            $optionsHelper = vchelper('Options');
            $optionsHelper->set('role-presets', $rolePresets);

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
            foreach ($partData[ $part ] as $roleCap) {
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

    protected function addVariables($variables, $payload)
    {
        $variables[] = [
            'key' => 'VCV_DEFAULT_CAPABILITIES',
            'type' => 'constant',
            'value' => vchelper('AccessUserCapabilities')->getDefaultCapabilities(),
        ];

        return $variables;
    }

    protected function addDefaultCapability($defaultCapabilities)
    {
        $defaultCapabilities['custom'] = [];

        return $defaultCapabilities;
    }

    protected function checkPresetUpdate($capabilities, $cap, $name)
    {
        if (strpos($cap, 'vcv_access_rules__')) {
            // check if role using preset
            $optionsHelper = vchelper('Options');
            $rolePresets = $optionsHelper->get('role-presets', []);
            $presetValue = isset($rolePresets[ $name ]) ? $rolePresets[ $name ] : 'custom';
            // if custom DO NOTHING
            if ($presetValue !== 'custom') {
                $userCapabilitiesHelper = vchelper('AccessUserCapabilities');
                $presetCapabilities = $userCapabilitiesHelper->getDefaultCapabilities();
                $rolePresetCapabilities = isset($presetCapabilities[ $presetValue ]) ? $presetCapabilities[ $presetValue ] : [];
                $capabilities = array_merge($capabilities, $rolePresetCapabilities);
            }
        }

        return $capabilities;
    }

    /**
     * For some user roles we need remove all capabilities.
     *
     * @param string $rolePresetValue
     * @param array $payload
     *
     * @return string
     */
    protected function changeRolePreset($rolePresetValue, $payload, Options $optionsHelper)
    {
        $savedPresets = $optionsHelper->get('role-presets', false);
        if ($savedPresets && array_search($payload['role'], $savedPresets)) {
            return $rolePresetValue;
        }

        $roleList = [
            'author',
            'contributor',
        ];

        if (in_array($payload['role'], $roleList) && $rolePresetValue === '') {
            $rolePresetValue = 'subscriber';
        }

        return $rolePresetValue;
    }
}
