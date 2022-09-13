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
$outputHelper = vchelper('Output');
$iframeUrl = add_query_arg(['post_type' => $slug, 'vcv-dashboard-iframe' => true], admin_url('edit.php'));
?>
<div class="vcv-dashboard-iframe-loader-wrapper vcv-dashboard-iframe-loader--visible">
    <div class="vcv-dashboard-loader vcv-dashboard-iframe-loader">
        <svg version="1.1" id="vc_wp-spinner-holeifr" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                x="0px" y="0px" width="16px" height="16px">
            <defs>
                <mask id="holeifr">
                    <rect width="100%" height="100%" fill="white" />
                    <circle r="2px" cx="50%" cy="25%" />
                </mask>
            </defs>
            <circle r="8px" cx="50%" cy="50%" mask="url(#holeifr)" fill="#808080" />
        </svg>
    </div>
</div>
<iframe class="vcv-dashboard-section-custom-post-type-iframe" src="<?php echo esc_url(
    $iframeUrl
); ?>" style="opacity:0"></iframe>
<script>
  (function () {
    let iframe = document.querySelector('.vcv-dashboard-section-custom-post-type-iframe')
    let overlay = document.querySelector('.vcv-dashboard-iframe-loader-wrapper')
    let isVcvClick = false

    function handleIframeBodyClick (e) {
      // In case we have some mass actions with our custom post types
      let isBunchAction = e.target.id && e.target.id.includes('doaction')
      // In case we have some action with our inner links
      let isVcvAction = e.target.href && e.target.href.includes('vcv-action')

      if (isVcvAction || isBunchAction) {
        isVcvClick = true
      } else {
        isVcvClick = false
      }

        <?php $outputHelper->printNotEscaped(vcfilter('vcv:resources:view:settings:pages:handleIframeBodyClick')); ?>
    }

    function setScrollHeight () {
      if (iframe && iframe.contentWindow && iframe.contentWindow.document && iframe.contentWindow.document.body) {
        // In case if iframe height significantly changed then change size of wrapper too
        if (Math.abs(parseInt(iframe.style.height || 0, 10) - iframe.contentWindow.document.body.scrollHeight) > 50) {
          iframe.style.height = iframe.contentWindow.document.body.scrollHeight + 50 + 'px'
        }
        iframe.contentWindow.document.body.addEventListener('click', handleIframeBodyClick)
      }
    }

    window.setInterval(setScrollHeight.bind(null, iframe), 100)

    function attachUnload () {
      isVcvClick = false
      // Remove the unloadHandler in case it was already attached.
      // Otherwise, the change will be dispatched twice.
      iframe.contentWindow.onbeforeunload = function () {
        if (!isVcvClick) {
          setTimeout(function () {
            overlay.classList.add('vcv-dashboard-iframe-loader--visible')
            iframe.style.opacity = 0
          }, 0)
        }
      }

      let style = document.createElement('style')
      style.innerHTML = 'body {\
      overflow-y: hidden;\
    }\
    #adminmenumain, #wpadminbar {\
      display: none !important;\
    }\
    #wpcontent, #wpfooter {\
      margin-left: 0 !important;\
    }\
    #wpfooter {\
      display: none !important;\
    }\
    html, #wpbody {\
      padding-top: 0 !important;\
    }\
    #wpcontent {\
      padding: 1px !important;\
    }\
    .wrap, #screen-meta, #screen-meta-links {\
      margin: 0 !important;\
    }\
    .wrap {\
      margin-top: 50px !important;\
    }\
    .wp-heading-inline {\
      padding-top: 0 !important;\
    }'
      iframe.contentWindow.document.body.appendChild(style)

      window.setTimeout(function () {
        overlay.classList.remove('vcv-dashboard-iframe-loader--visible')
        iframe.style.opacity = 1
      }, 1000)
    }

    iframe.addEventListener('load', attachUnload)
    iframe.addEventListener('load', setScrollHeight)
  })()
</script>
