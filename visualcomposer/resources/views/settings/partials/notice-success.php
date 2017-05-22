<?php

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

?>
<div class="updated">
    <p><?php echo $message ?></p>
</div>