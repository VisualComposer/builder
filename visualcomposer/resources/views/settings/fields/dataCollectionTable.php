<?php

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
?>

<div class="vcv-ui-settings-data-collection-table-container">
    <div class="vcv-data-collection-table-toggle">
        <a id="vcv-data-collection-table-button" href="javascript:void(0)"><?php echo esc_html__('What kind of data will I share?', 'visualcomposer') ?></a>
    </div>
    <div class="vcv-ui-settings-data-collection-table-wrapper" id="vcv-ui-settings-data-collection-table" style="display: none;">
        <table class="vcv-ui-settings-data-collection-table">
            <tbody>
                <tr>
                    <td><?php echo esc_html__('Editor', 'visualcomposer') ?>:</td>
                    <td><?php echo esc_html__('License type, site and page ids (de-identified),  how long the editor has been used', 'visualcomposer') ?></td>
                </tr>
                <tr>
                    <td><?php echo esc_html__('Elements', 'visualcomposer') ?>:</td>
                    <td><?php echo esc_html__('Which elements are used and downloaded, site and page ids (de-identified)', 'visualcomposer') ?></td>
                </tr>
                <tr>
                    <td><?php echo esc_html__('Templates', 'visualcomposer') ?>:</td>
                    <td><?php echo esc_html__('Which templates are used and downloaded, site and page ids (de-identified)', 'visualcomposer') ?></td>
                </tr>
                <tr>
                    <td><?php echo esc_html__('System', 'visualcomposer') ?>:</td>
                    <td><?php echo esc_html__('Plugin version, WordPress version, Active WordPress theme, PHP version', 'visualcomposer') ?></td>
                </tr>
            </tbody>
        </table>
        <div class="vcv-description">
            <p class="description"><?php echo esc_html__('We will never collect any sensivite or private data such as IP addresses, email, usernames, or passwords.', 'visualcomposer'); ?></p>
        </div>
    </div>
</div>
