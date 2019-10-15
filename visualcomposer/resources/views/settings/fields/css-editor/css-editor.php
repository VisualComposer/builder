<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

/** @var array $globalSetting */
?>

<div class="vcv-ui-form-editor-container">
    <textarea id="vcv-<?php echo $globalSetting['slug']; ?>" class="vcv-css-code-editor" name="vcv-<?php echo $globalSetting['slug']; ?>"><?php echo (isset($globalSetting['value'])) ? $globalSetting['value'] : ''; ?></textarea>
    <textarea id="vcv-<?php echo $globalSetting['slug']; ?>-compiled" style="display:none;" name="vcv-<?php echo $globalSetting['slug']; ?>-compiled">not-changed</textarea>
</div>