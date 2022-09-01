<?php

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
/**
 * @var string $role
 * @var array $dropdownOptions
 * @var string $presetValue
 */
?>
<div class="vcv-settings-section vcv-settings_vcv-settings-gutenberg-editor-enabled">
    <div class="vcv-ui-settings-status-tables-wrapper">
        <div class="vcv-ui-settings-status-table">
            <p class="description"><?php
                // translators: %s: role name.
                echo sprintf(esc_html__('Select user role preset for %s or customize access rights.', 'visualcomposer'), esc_attr($role)); ?></p>
        </div>
        <div class="vcv-ui-settings-status-table">
            <?php
            evcview(
                'settings/fields/dropdown',
                [
                    'name' => 'vcv-settings-role-preset[' . $role . ']',
                    'class' => 'vcv-ui-form-presets-dropdown',
                    'value' => !empty($presetValue) ? $presetValue : (array_key_exists($role, $dropdownOptions) ? $role : 'custom'),
                    'enabledOptions' => $dropdownOptions,
                ]
            );
            ?>
        </div>
    </div>
</div>
