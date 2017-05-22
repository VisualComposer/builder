<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
/** @var $elements array - list of elements & data */
?>
<script id="vcv-hub-elements">
  // Read-Only data
  Object.defineProperty(window, 'VCV_HUB_GET_ELEMENTS', {
    value: function () {
      return <?php echo json_encode(
        $elements
    ); ?> },
    writable: false
  });
</script>
