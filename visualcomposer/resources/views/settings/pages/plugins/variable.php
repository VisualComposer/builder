<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
?>
<script>
  window.vcvPluginName = '<?php echo esc_attr(VCV_PLUGIN_BASE_NAME); ?>';
</script>