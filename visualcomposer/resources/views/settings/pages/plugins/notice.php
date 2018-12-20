<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

global $status, $page, $s, $totals;
?>
<script type="text/html" id="vcv-deactivation-notice-template">
    <tr class="plugin-update-tr" id="vcv-visual-composer-website-builder">
        <td colspan="3" class="plugin-update colspanchange">
            <div class="notice inline notice-warning notice-alt">
                <p><?php
                    printf(
                        __(
                            'You are about to deactivate your copy of Visual Composer Website Builder and won’t be able to manage your content. Your content remains untouched but due to plugin deactivation required CSS styles will be missing. To ensure correct content display use
                    <a href="%s">this free plugin</a> that will load CSS styles automatically.',
                            'vcwb'
                        ),
                        'https://visualcomposer.com/deactivate'
                    );
                    ?>
                </p>
                <p>
                    <a href="<?php
                    $url = sprintf(
                        'plugins.php?action=deactivate&plugin=%s&plugin_status=%s&paged=%s&s=%s',
                        esc_attr(VCV_PLUGIN_BASE_NAME),
                        esc_attr($status),
                        esc_attr($page),
                        esc_attr($s)
                    );
                    echo wp_nonce_url(
                        $url,
                        'deactivate-plugin_' . esc_attr(VCV_PLUGIN_BASE_NAME)
                    );
                    ?>" class="vcv-deactivation-submit-button button button-primary"><?php
                        echo esc_html__(
                            'Deactivate Visual Composer',
                            'vcwb'
                        ); ?></a>
                </p>
            </div>
        </td>
    </tr>
</script>
<script>
  // Code for Deactivation Notice
  (function ($) {
    $(function () {
      var $pluginRow = $('[data-plugin="<?php echo VCV_PLUGIN_BASE_NAME; ?>"]').eq(0)
      if ($pluginRow.length) {
        var $deactivationLink = $pluginRow.find('.deactivate a')
        var noticeShown = false
        var template = $('#vcv-deactivation-notice-template').html()
        var showNotice = function () {
          if (!noticeShown) {
            noticeShown = true
            $(template).insertAfter($pluginRow)
          }
        }

        $deactivationLink.click(function (e) {
          if (!noticeShown) {
            e.preventDefault()
            showNotice()
          }
        })
        $(document).on('click', '.vcv-deactivation-submit-button', function (e) {
          e.preventDefault()
          $deactivationLink.get(0).click()
        })
      }
    })
  })(window.jQuery)
</script>
