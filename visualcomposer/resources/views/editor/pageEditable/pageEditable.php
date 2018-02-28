<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
?>
<script>
  jQuery.fn.ready = function (param) {
    try {
      window.setTimeout(function () {
        param.call(this, jQuery)
      }, 300)
    } catch (e) {
        <?php if (VCV_DEBUG) : ?>
      console.warn('jquery ready failed', e, param)
        <?php endif; ?>
    }

    return this
  }
</script>
<div id="vcv-editor"><?php echo esc_html__('Loading...', 'vcwb'); ?></div>