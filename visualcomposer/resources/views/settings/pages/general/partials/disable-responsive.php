<?php

if (!defined('ABSPATH')) {
    die('-1');
}

$attributes = [
    'id="' . VC_V_PREFIX . 'not_responsive_css"',
    'name="' . VC_V_PREFIX . 'not_responsive_css"',
    ($checked ? ' checked' : null),
];

?>
<label>
    <input type="checkbox" value="1" <?php echo implode(' ', $attributes) ?> />
    <?php echo __('Disable', 'vc5') ?>
</label>

<br/>

<p class="description indicator-hint">
    <?php echo __(
        'Disable content elements from "stacking" one on top other on small media screens (Example: mobile devices).',
        'vc5'
    ) ?>
</p>