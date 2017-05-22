<?php

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

$attributes = [
    'id="' . VCV_PREFIX . 'not_responsive_css"',
    'name="' . VCV_PREFIX . 'not_responsive_css"',
    ($checked ? ' checked' : null),
];

?>
<label>
    <input type="checkbox" value="1" <?php echo implode(' ', $attributes) ?> />
    <?php echo __('Disable', 'vcwb') ?>
</label>

<br/>

<p class="description indicator-hint">
    <?php echo __(
        'Disable content elements from "stacking" one on top other on small media screens (Example: mobile devices).',
        'vcwb'
    ) ?>
</p>