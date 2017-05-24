<?php

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
/** @var \VisualComposer\Helpers\Nonce $nonceHelper */
$nonceHelper = vchelper('Nonce');
// TODO: Check vcvNonce in frontend.php
?>
<script>
    window.vcvNonce = '<?php echo $nonceHelper->admin(); ?>';
</script>