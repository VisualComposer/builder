<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

evcview('settings/partials/admin-nonce');
?>
<div class="wrap vcv-settings">
    <h2><?php echo esc_html__('Settings', 'vcwb') ?></h2>
    <?php
    // @codingStandardsIgnoreLine
    echo $content;
    ?>
</div>