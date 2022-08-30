<?php

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

/** @var array $globalSetting */
$outputHelper = vchelper('Output');
?>
<div class="vcv-ui-form-editor-container">
    <textarea id="vcv-<?php echo esc_attr($globalSetting['slug']); ?>" class="vcv-js-code-editor" name="vcv-<?php echo esc_attr($globalSetting['slug']); ?>"><?php $outputHelper->printNotEscaped($globalSetting['value']); ?></textarea>
</div>
