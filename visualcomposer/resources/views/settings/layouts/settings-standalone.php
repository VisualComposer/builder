<?php
if (!defined('ABSPATH')) {
    die('-1');
}

echo vcview('settings/partials/admin-nonce');
?>
<div class="wrap vcv-settings">
    <h2><?php echo __('Settings', 'vc5') ?></h2>
    <?php echo $content ?>
</div>