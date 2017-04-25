<?php
global $status, $page, $s, $totals;
?>
<script type="text/html" id="vcv-deactivation-notice-template">
    <tr class="plugin-update-tr" id="vcv-visual-composer-website-builder">
        <td colspan="3" class="plugin-update colspanchange">
            <div class="notice inline notice-warning notice-alt">
                <p>You have deactivated your copy of Visual Composer Website Builder and won't be able to manage layout that has been created. We will not remove any layout that was created, yet, due to deactivation, it is not using necessary style. To ensure correct layout display, please copy this snippet into your theme's function.php or use this free plugin that will do all the work for you automatically.<br><br>Regards, Michael M, CEO at WPBakery
                    <a href="">Plugin with snippet</a>
                </p>
                <p>
                    <a href="<?php echo wp_nonce_url(
                        'plugins.php?action=deactivate&amp;plugin=' . VCV_PLUGIN_BASE_NAME . '&amp;plugin_status='
                        . $status . '&amp;paged=' . $page . '&amp;s=' . $s,
                        'deactivate-plugin_' . VCV_PLUGIN_BASE_NAME
                    ) ?>" class="vcv-deactivation-submit-button button button-primary">Deactivate Visual Composer</a>
                </p>
            </div>
        </td>
    </tr>
</script>