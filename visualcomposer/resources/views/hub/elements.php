<?php
/** @var $elements array - list of elements & data */
?>
<script id="vcv-hub-elements">
  // Read-Only data
  window.vcvGetElementsList = function () {
    return <?php json_encode($elements); ?>
  }
</script>
