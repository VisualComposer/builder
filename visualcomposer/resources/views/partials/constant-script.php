<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
/** @var array $values */
/** @var string $key */
?>
<script id="vcv-<?php echo esc_attr(vchelper('Str')->slugify($key)); ?>">
  // Read-Only data
  Object.defineProperty(window, '<?php echo esc_js($key); ?>', {
    value: function () {
      // @codingStandardsIgnoreLine
      return <?php echo json_encode($value); ?> },
    writable: false
  });
</script>
