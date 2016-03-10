<?php

if (!defined('ABSPATH')) {
    die('-1');
}

?>
<script>
    var vcAdminNonce = '<?php echo vcapp('VisualComposer\Helpers\Wordpress\Nonce')->admin() ?>';
</script>