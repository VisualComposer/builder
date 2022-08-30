<?php

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

/** @var bool $isEnabled */
/** @var string $name */
/** @var string $value */
/** @var string $title */
/** @var string $onTitle */
/** @var string $offTitle */
?>

<div class="vcv-ui-form-switch-container">
    <label class="vcv-ui-form-switch">
        <input type="checkbox" value="<?php echo esc_attr($value); ?>" name="<?php echo esc_attr($name); ?>" <?php echo $isEnabled ? 'checked="checked"' : ''; ?> />
        <span class="vcv-ui-form-switch-indicator"></span>
        <span class="vcv-ui-form-switch-label" data-vc-switch-on="<?php echo esc_attr($onTitle); ?>"></span>
        <span class="vcv-ui-form-switch-label" data-vc-switch-off="<?php echo esc_attr($offTitle); ?>"></span>
    </label>
    <span><?php echo isset($title) ? esc_html($title) : ''; ?></span>
</div>
