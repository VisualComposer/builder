<?php

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
/** @var \VisualComposer\Helpers\Nonce $nonceHelper */
$nonceHelper = vchelper('Nonce');
?>
<script>
  window.vcvNonce = '<?php echo esc_attr($nonceHelper->admin()); ?>';
</script>
