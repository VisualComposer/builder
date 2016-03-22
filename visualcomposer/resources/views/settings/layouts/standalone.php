<?php
if (!defined('ABSPATH')) {
    die('-1');
}

vcview('settings/partials/admin-nonce');
?>
<div class="wrap vc_settings">
    <?php echo $content ?>
</div>