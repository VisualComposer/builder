<?php
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
<?php
foreach ($elements as $key => $url):
    ?>
    <script id="vcv-hub-element-<?php echo $key; ?>" src="<?php echo $url; ?>"></script>
    <?php
endforeach;
