<?php

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

/** @var array $enabledPostTypes */
/** @var array $postType */
?>

<div class="vcv-ui-form-switch-container">
    <label class="vcv-ui-form-switch">
        <input type="checkbox" value="<?php echo esc_attr(
            $postType['value']
        ); ?>" name="vcv-post-types[]" <?php echo in_array(
            $postType['value'],
            $enabledPostTypes,
            true
        ) ? 'checked="checked"' : ''; ?> />
        <span class="vcv-ui-form-switch-indicator"></span>
        <span class="vcv-ui-form-switch-label" data-vc-switch-on="<?php echo esc_attr__('on', 'visualcomposer'); ?>"></span>
        <span class="vcv-ui-form-switch-label" data-vc-switch-off="<?php echo esc_attr__('off', 'visualcomposer'); ?>"></span>
    </label>
</div>
