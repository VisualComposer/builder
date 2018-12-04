<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

/** @var array $globalSetting */
?>

<div class="vcv-ui-form-editor-container">
    <textarea id="vcv-<?php echo $globalSetting['slug']; ?>" class="vcv-js-code-editor" name="vcv-<?php echo $globalSetting['slug']; ?>"><?php echo $globalSetting['value']; ?></textarea>
</div>