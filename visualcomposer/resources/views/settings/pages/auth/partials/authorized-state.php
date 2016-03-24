<?php

if (!defined('ABSPATH')) {
    die('-1');
}

?>

<div class="vcv-settings-page-authorization">
    <p class="vcv-access" data-vcv-state="authorize">1. Authorize Site: [Done] <?php
        echo vcapp('optionsHelper')->get(
            'page-auth-token'
        ); ?></p>
    Note that token live is 1hr.
    <?php vcview('settings/pages/auth/partials/unauthorized-state'); ?>
</div>
