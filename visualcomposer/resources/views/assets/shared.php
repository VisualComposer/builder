<?php
// Output the shared assets library list
/** @var $assets array - list of shared assets libraries */
?>
<script id="vcv-shared-assets">
  // Read-Only data
  Object.defineProperty(window, 'VCV_GET_SHARED_ASSETS', {
    value: function () {
      return <?php echo json_encode(
        $assets
    ); ?> },
    writable: false
  });
</script>
