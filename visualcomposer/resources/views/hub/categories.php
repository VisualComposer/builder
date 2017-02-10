<?php
/** @var $categories array - list of categories & data */
?>
<script id="vcv-hub-categories">
  // Read-Only data
  window.vcvGetCategoriesList = function () {
    return <?php json_encode($categories); ?>
  }
</script>
