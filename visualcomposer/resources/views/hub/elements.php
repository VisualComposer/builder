<?php
/** @var $elements array - list of elements & data */
?>
<script id="vcv-hub-elements">
  // Read-Only data
  Object.defineProperty(window, 'VCV_GET_ELEMENTS', {
    value: function () {
      return <?php echo json_encode(
        $elements
    ); ?> },
    writable: false
  });
</script>
