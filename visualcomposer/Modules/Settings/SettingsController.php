<?php

namespace VisualComposer\Modules\Settings;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Access\CurrentUser;
use VisualComposer\Helpers\License;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Settings\TabsRegistry;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Class SettingsController
 * @package VisualComposer\Modules\Settings
 */
class SettingsController extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    /**
     * SettingsController constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\Settings\SettingsController::saveSettings */
        $this->addFilter('vcv:ajax:settings:save:adminNonce', 'saveSettings');
        /** @see \VisualComposer\Modules\Settings\SettingsController::saveNotice */
        $this->wpAddAction(
            'admin_notices',
            'saveNotice'
        );
        /** @see \VisualComposer\Modules\Settings\SettingsController::beforeRenderRedirect */
        $this->wpAddAction('admin_init', 'beforeRenderRedirect', 100);

        /** @see \VisualComposer\Modules\Settings\SettingsController::addActionLinks */
        $this->wpAddFilter(
            'plugin_action_links_' . VCV_PLUGIN_BASE_NAME,
            'addActionLinks',
            10,
            1
        );
    }

    /**
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\Access\CurrentUser $currentUserAccess
     *
     * @throws \Exception
     */
    protected function saveSettings($response, $payload, Request $requestHelper, CurrentUser $currentUserAccess)
    {
        vcevent('vcv:settings:save');
        $hasAccess = null;
        $slug = $requestHelper->input('vcv-page-slug');
        $pageInfo = vchelper('SettingsTabsRegistry')->get($slug);
        $hasAccess = false;
        if (!empty($pageInfo)) {
            $capability = 'manage_options';
            $part = null;
            if (isset($pageInfo['capability'])) {
                $capability = $pageInfo['capability'];
            }

            if (isset($pageInfo['capabilityPart']) && vcvenv('VCV_ADDON_ROLE_MANAGER_ENABLED')) {
                $part = $pageInfo['capabilityPart'];
            }
            $currentUserAccess = vchelper('AccessCurrentUser');
            if (!empty($part)) {
                $hasAccess = $currentUserAccess->part($part)->checkState(true)->get();
            } else {
                // Fallback to default logic
                $hasAccess = $currentUserAccess->wpAll($capability)->get();
            }
        }

        if ($hasAccess) {
            $fieldsRegistry = vchelper('SettingsFieldsRegistry');
            $requestHelper = vchelper('Request');
            $optionsHelper = vchelper('Options');
            $updatedFields = $fieldsRegistry->findBySlug($slug, 'group');
            if (is_array($updatedFields)) {
                foreach ($updatedFields as $field) {
                    $optionsHelper->set(
                        $field['name'],
                        $requestHelper->input(VCV_PREFIX . $field['name'], '')
                    );
                }
            }

            $response = ['status' => true];
            wp_send_json($response);
            exit;
        }

        header('Status: 403 Forbidden');
        header('HTTP/1.1 403 Forbidden');
        exit;
    }

    /**
     *
     */
    protected function saveNotice()
    {
        $requestHelper = vchelper('Request');
        $message = $requestHelper->input('vcv-message');
        if ($message === 'vcv-saved') {
            echo sprintf(
                '<div class="notice notice-success"><p>%s</p></div>',
                esc_html__('Your settings are saved.', 'visualcomposer')
            );
        }
    }

    /**
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\Settings\TabsRegistry $tabsRegistry
     * @param \VisualComposer\Helpers\License $licenseHelper
     * @param \VisualComposer\Helpers\Options $optionsHelper
     */
    protected function beforeRenderRedirect(
        Request $requestHelper,
        TabsRegistry $tabsRegistry,
        License $licenseHelper,
        Options $optionsHelper
    ) {
        $page = $requestHelper->input('page');
        if (
            $page
            && !in_array($page, ['vcv-settings', 'vcv-update', 'vcv-license'], true)
            && strpos($page, 'vcv-') !== false
        ) {
            $updateRequired = vchelper('Options')->get('bundleUpdateRequired');
            if (($licenseHelper->isPremiumActivated() || $optionsHelper->get('agreeHubTerms')) && $updateRequired) {
                // Redirect only if requested page is settings tab page
                if ($tabsRegistry->get($page)) {
                    // Redirect if bundle update available
                    // Redirect only if slug !== vcv-settings (to allow reset)
                    wp_safe_redirect(admin_url('admin.php?page=vcv-update'));
                    exit;
                }
            }
        }
    }

    /**
     * Add plugin action links.
     * You can find them in wp dashboard > plugins section.
     *
     * @param array $links
     *
     * @return array
     */
    protected function addActionLinks($links)
    {
        return array_merge(
            [
                sprintf(
                    '<a href="%s">%s</a>',
                    esc_url(admin_url('admin.php?page=vcv-settings')),
                    esc_html__('Settings', 'visualcomposer')
                ),
            ],
            $links
        );
    }
}
