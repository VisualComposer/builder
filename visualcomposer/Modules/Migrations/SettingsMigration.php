<?php

namespace VisualComposer\Modules\Migrations;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;

class SettingsMigration extends MigrationsController implements Module
{
    protected $migrationId = 'settingsMigration220';

    protected $migrationPriority = 11;

    protected function run(Options $optionsHelper)
    {
        // Since release 22.0 we dropped the ability to store settings in multiple fields (associative array).
        // Now ALL Visual Composer settings options will be single values

        // Migrate vcv-settings (gutenberg, maintenanceMode)
        $settings = $optionsHelper->get('settings', 'not-exists');
        if ($settings !== 'not-exists') {
            $gutenbergEnabled = is_array($settings) ? in_array('gutenberg-editor', $settings, true) : '';
            // Gutenberg
            $optionsHelper->set('settings-gutenberg-editor-enabled', $gutenbergEnabled);

            // Maintenance Mode
            if (is_array($settings)) {
                $maintenanceModeEnabled = in_array('maintenanceMode-enabled', $settings, true);
                $maintenanceModePage = array_key_exists(
                    'vcv-maintenanceMode-page',
                    $settings
                ) ? $settings['vcv-maintenanceMode-page'] : '';

                $optionsHelper->set('settings-maintenanceMode-enabled', $maintenanceModeEnabled);
                $optionsHelper->set('settings-maintenanceMode-page', $maintenanceModePage);
            }

            $optionsHelper->delete('settings');
        }

        // Migrate vcv-frontendSettings (preview)
        $frontendSettings = $optionsHelper->get('frontendSettings', 'not-exists');
        if (is_array($frontendSettings)) {
            $isDisabled = array_key_exists('itemPreviewDisabled', $frontendSettings) && $frontendSettings['itemPreviewDisabled'];
            $isEnabled = !$isDisabled ? 1 : ''; // update_option false may not work.
            $optionsHelper->set('settings-itempreview-enabled', $isEnabled);

            $optionsHelper->delete('frontendSettings');
        }

        return true;
    }
}
