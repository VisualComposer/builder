<?php
/** @var array $values */
/** @var string $key */
?>
<script id="vcv-<?php echo strtolower($key); ?>">
  // Read-Only data
  Object.defineProperty(window, '<?php echo $key; ?>', {
    value: function () {
      return <?php echo json_encode(
        $values
    ); ?> },
    writable: false
  });
</script>
