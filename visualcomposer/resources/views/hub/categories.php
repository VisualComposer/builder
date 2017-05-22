<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
/** @var $categories array - list of categories & data */
?>
<script id="vcv-hub-categories">
  // Read-Only data
  Object.defineProperty(window, 'VCV_HUB_GET_CATEGORIES', {
    value: function () {
      return <?php echo json_encode(
        $categories
    ); ?> },
    writable: false
  });
</script>
