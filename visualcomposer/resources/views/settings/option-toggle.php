<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

/** @var array $enabledOptions */
/** @var sting $value */
?>

<div class="vcv-ui-form-switch-container">
    <label class="vcv-ui-form-switch">
        <input type="checkbox" value="<?php echo esc_attr(
            $value
        ); ?>" name="vcv-settings[]" <?php echo in_array(
            $value,
            $enabledOptions,
            true
        ) ? 'checked="checked"' : ''; ?> />
        <span class="vcv-ui-form-switch-indicator"></span>
        <span class="vcv-ui-form-switch-label" data-vc-switch-on="<?php echo esc_attr__('on', 'vcwb'); ?>"></span>
        <span class="vcv-ui-form-switch-label" data-vc-switch-off="<?php echo esc_attr__('off', 'vcwb'); ?>"></span>
    </label>
</div>
