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
                    // @codingStandardsIgnoreLine
                        __(
                            'You are about to deactivate your copy of Visual Composer Website Builder and won’t be able to manage your content. Your content remains untouched but due to plugin deactivation required CSS styles will be missing. To ensure correct content display use
                    <a href="%s">this free plugin</a> that will load CSS styles automatically.',
                            'vcwb'
                        ),
                        'https://visualcomposer.io/deactivate'
                    );
                    ?>
                </p>
                <p>
                    <a href="<?php
                    // @codingStandardsIgnoreLine
                    echo wp_nonce_url(
                        'plugins.php?action=deactivate&plugin=' . VCV_PLUGIN_BASE_NAME . '&plugin_status='
                        . esc_attr($status) . '&paged=' . esc_attr($page) . '&s=' . esc_attr($s),
                        'deactivate-plugin_' . esc_attr(VCV_PLUGIN_BASE_NAME)
                    );
                    ?>" class="vcv-deactivation-submit-button button button-primary"><?php echo esc_html__(
                            'Deactivate Visual Composer',
                            'vcwb'
                        ) ?></a>
                </p>
            </div>
        </td>
    </tr>
</script>