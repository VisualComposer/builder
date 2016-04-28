<?php

if (!defined('ABSPATH')) {
    die('-1');
}
/** @var \VisualComposer\Helpers\Nonce $nonceHelper */
$nonceHelper = vchelper('Nonce');
?>
<script>
    var vcvAdminNonce = '<?php echo $nonceHelper->admin(); ?>';
</script>