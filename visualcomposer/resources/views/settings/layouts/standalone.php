<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

echo vcview('settings/partials/admin-nonce');
?>
<div class="wrap vcv-settings">
    <?php echo $content ?>
</div>