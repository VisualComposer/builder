<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

/** @var array $globalSetting */
?>

<div class="vcv-ui-form-editor-container">
    <textarea name="<?php echo $globalSetting['slug']; ?>"><?php echo $globalSetting['value']; ?></textarea>
</div>
