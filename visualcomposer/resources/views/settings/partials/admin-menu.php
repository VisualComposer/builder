<?php

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

?>
<style>
    /** Fixes min-width for long sidebar nav **/
    #adminmenu .wp-not-current-submenu .wp-submenu li.vcv-dashboard-admin-menu--add {
        min-width: 220px;
    }
</style>
