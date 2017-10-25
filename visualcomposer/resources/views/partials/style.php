<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
/** @var string $value */
/** @var string $key */
?>
<style id="vcv-<?php echo vchelper('Str')->slugify($key); ?>">
    <?php echo $value; ?>
</style>
