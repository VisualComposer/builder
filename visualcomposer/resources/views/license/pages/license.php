<?php

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}
$urlHelper = vchelper('Url');
$nonceHelper = vchelper('Nonce');

$refreshUrl = $urlHelper->adminAjax(
    ['vcv-action' => 'license:refresh:adminNonce', 'vcv-nonce' => $nonceHelper->admin()]
);
$deactivateUrl = $urlHelper->adminAjax(
    ['vcv-action' => 'license:deactivate:adminNonce', 'vcv-nonce' => $nonceHelper->admin()]
);

$expirationDate = vchelper('License')->getExpirationDate();
?>
<div class="vcv-ui-settings-status-table-container">
    <h2><?php echo esc_html__('License Information', 'visualcomposer') ?></h2>
    <div class="vcv-description">
        <p class="description"><?php echo esc_html__(
            'Visual Composer license information. Click refresh to check for license updates',
            'visualcomposer'
        ); ?></p>
        <a href="<?php echo esc_url($refreshUrl); ?>" class="button vcv-license-btn-refresh"><?php echo esc_html__(
            'Refresh',
            'visualcomposer'
        ); ?></a>
    </div>

    <div class="vcv-ui-settings-status-tables-wrapper">
        <table class="vcv-ui-settings-status-table">
            <thead>
            <tr>
                <th colspan="3"><?php echo esc_html__('License information', 'visualcomposer') ?></th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td><?php echo esc_html__('License Key', 'visualcomposer') ?>:</td>
                <td><?php echo vchelper('License')->getHiddenKey(); ?> <a href="<?php echo esc_url(
                    $deactivateUrl
                ); ?>" class="vcv-license-btn-deactivate"><?php echo esc_html__(
                    'Deactivate',
                    'visualcomposer'
                ); ?></a>
                </td>
            </tr>
            <tr>
                <td><?php echo esc_html__('License Type', 'visualcomposer') ?>:</td>
                <td><?php echo ucfirst(vchelper('License')->getType()); ?></td>
            </tr>
            <?php if (!empty($expirationDate)) : ?>
                <tr>
                    <td><?php echo esc_html__('License Expiration', 'visualcomposer') ?>:</td>
                    <td><?php
                        echo $expirationDate !== 'lifetime' ? date(
                            get_option('date_format') . ' ' . get_option('time_format'),
                            $expirationDate
                        ) : 'lifetime'; ?></td>
                </tr>
            <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>
