<?php
if (!defined('ABSPATH')) {
    die('-1');
}

vcapp('VisualComposer\Helpers\Generic\Templates')->render('settings/partials/admin-nonce');
?>
<div class="wrap vc_settings">
    <?php echo $content ?>
</div>