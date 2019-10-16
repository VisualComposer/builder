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
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Settings\TabsRegistry;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class SettingsController extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    public function __construct()
    {
        $this->addFilter('vcv:ajax:settings:save:adminNonce', 'saveSettings');
        $this->wpAddAction(
            'admin_notices',
            'saveNotice'
        );
        $this->wpAddAction('admin_init', 'beforeRenderRedirect', 100);
    }

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

    protected function saveNotice()
    {
        if (isset($_REQUEST['message']) && $_REQUEST['message'] === 'vcv-saved') {
            echo sprintf(
                '<div class="notice notice-success"><p>%s</p></div>',
                __('Settings Saved', 'visualcomposer')
            );
        }
    }

    protected function beforeRenderRedirect(Request $requestHelper, TabsRegistry $tabsRegistry)
    {
        $page = $requestHelper->input('page');
        if ($page && $page !== 'vcv-settings' && $page !== 'vcv-update' && strpos($page, 'vcv-') !== false) {
            $updateRequired = vchelper('Options')->get('bundleUpdateRequired');
            if ($updateRequired) {
                $tabs = vcfilter('vcv:settings:tabs', $tabsRegistry->all());
                // Redirect only if requested page is settings page
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
