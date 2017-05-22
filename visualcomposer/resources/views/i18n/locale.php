<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
/** @var array $locale */
?>
<script id="vcv-i18n">
  // Read-Only data
  Object.defineProperty(window, 'VCV_I18N', {
    value: function () {
      return <?php echo json_encode(
        $locale
    ); ?> },
    writable: false
  });
</script>
