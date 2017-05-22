<?php

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

?>

<div class="vcv-settings-page-authorization">
    <p class="vcv-access" data-vcv-state="authorize">1. Authorize Site: [Done]</p>
    Note that token live is 1hr.
    <?php echo vcview('settings/pages/auth/partials/unauthorized-state'); ?>
</div>
