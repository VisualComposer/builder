<?php

if (!defined('ABSPATH')) {
    die('-1');
}
/** @var \VisualComposer\Helpers\Nonce $nonceHelper */
$nonceHelper = vchelper('Nonce');
// TODO: Check vcvNonce in frontend.php
?>
<script>
    var vcvNonce = '<?php echo $nonceHelper->admin(); ?>';
</script>