<?php

if (!defined('ABSPATH')) {
    die('-1');
}

use VisualComposer\Helpers\WordPress\Nonce;

?>
<script>
    var vcAdminNonce = '<?= Nonce::admin() ?>';
</script>