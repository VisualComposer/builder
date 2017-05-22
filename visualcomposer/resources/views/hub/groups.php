<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
/** @var $groups array - list of categories groups */
?>
<script id="vcv-hub-groups">
  // Read-Only data
  Object.defineProperty(window, 'VCV_HUB_GET_GROUPS', {
    value: function () {
      return <?php echo json_encode(
        $groups
    ); ?> },
    writable: false
  });
</script>
