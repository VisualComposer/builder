<?php

if (!defined('ABSPATH')) {
    die('-1');
}
/** @var \VisualComposer\Helpers\WordPress\Nonce $nonceHelper */
$nonceHelper = vchelper('nonce');
?>
<script>
    var vcvAdminNonce = '<?php echo $nonceHelper->admin(); ?>';
</script>