<?php
/** @var array $locale */
?>
<script id="vcv-i18n">
  // Read-Only data
  Object.defineProperty(window, 'VCV_I18N', {
    value: function () {
      return <?php echo json_encode(
        $locale
    ); ?> },
    writable: false
  });
</script>
