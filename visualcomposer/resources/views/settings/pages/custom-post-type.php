<?php

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
/** @var $controller \VisualComposer\Modules\Settings\Pages\Settings */
/** @var string $slug */
if ($slug !== vchelper('Request')->input('page')) {
    return;
}
$iframeUrl = add_query_arg(['post_type' => $slug, 'vcv-dashboard-iframe' => true], admin_url('edit.php'));
?>

<iframe class="vcv-dashboard-section-custom-post-type-iframe" src="<?php echo esc_url(
    $iframeUrl
); ?>" onload="this.style.height=(this.contentWindow.document.body.scrollHeight + 50) + 'px';"></iframe>
<script>
  function setScrollHeight (iframe) {
    if (iframe && iframe.contentWindow && iframe.contentWindow.document && iframe.contentWindow.document.body) {
      // In case if iframe height significantly changed then change size of wrapper too
      if (Math.abs(parseInt(iframe.style.height, 10) - iframe.contentWindow.document.body.scrollHeight) > 50) {
        iframe.style.height = iframe.contentWindow.document.body.scrollHeight + 50 + 'px'
      }
    }
  }

  window.setInterval(setScrollHeight.bind(null, document.querySelector('.vcv-dashboard-section-custom-post-type-iframe')), 100)
</script>
