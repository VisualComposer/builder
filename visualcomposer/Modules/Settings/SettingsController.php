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
    }

    /**
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\Access\CurrentUser $currentUserAccess
     *
     * @throws \Exception
     */
    protected function saveSettings($response, $payload, CurrentUser $currentUserAccess)
    {
        if ($currentUserAccess->can('manage_options')->get()) {
            $fieldsRegistry = vchelper('SettingsFieldsRegistry');
            $requestHelper = vchelper('Request');
            $optionsHelper = vchelper('Options');
            $updatedFields = $requestHelper->inputJson('vcv-settings-rendered-fields');
            if (is_array($updatedFields)) {
                foreach ($updatedFields as $fieldKey) {
                    $fieldName = str_replace(VCV_PREFIX, '', $fieldKey);
                    $fieldGroup = $fieldsRegistry->findBySlug($fieldName, 'name');
                    if (count($fieldGroup) > 0) {
                        $optionsHelper->set($fieldName, $requestHelper->input(VCV_PREFIX . $fieldName, ''));
                    } else {
                        header('Status: 403 Forbidden');
                        header('HTTP/1.1 403 Forbidden');
                        exit;
                    }
                }
            }
            $referer = wp_get_raw_referer();
            if (!$referer) {
                $referer = admin_url('admin.php?page=vcv-settings');
            }
            wp_safe_redirect(vchelper('Url')->query($referer, ['message' => 'vcv-saved']));
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
        if (isset($_REQUEST['message']) && $_REQUEST['message'] === 'vcv-saved') {
            echo sprintf(
                '<div class="notice notice-success"><p>%s</p></div>',
                __('Your settings are saved.', 'visualcomposer')
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
                $tabs = vcfilter('vcv:settings:tabs', $tabsRegistry->all());
                // Redirect only if requested page is settings tab page
                if (array_key_exists($page, $tabs)) {
                    // Redirect if bundle update available
                    // Redirect only if slug !== vcv-settings (to allow reset)
                    wp_redirect(admin_url('admin.php?page=vcv-update'));
                    exit;
                }
            }
        }
    }
}
