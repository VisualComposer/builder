<?php
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
