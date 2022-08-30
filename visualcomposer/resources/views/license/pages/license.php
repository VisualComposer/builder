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

$activateHubUrl = admin_url('admin.php?page=vcv-activate-license&vcv-ref=license-vcdashboard');
$upgradeLicenseUrl = vcvenv('VCV_HUB_LICENSES_URL');

$expirationDate = vchelper('License')->getExpirationDate();
if (!vchelper('License')->isPremiumActivated()) {
    echo sprintf(
        '<div class="vcv-description vcv-description--no-flex"><p class="description">%s</p>',
        esc_html__(
            'It seems you haven’t activated your Premium license to access elements, templates, and addons in the Visual Composer Hub.',
            'visualcomposer'
        )
    );
    echo sprintf(
        '<a href="%s" class="button vcv-license-btn-activate-hub">%s</a>',
        esc_url($activateHubUrl),
        esc_html__('Activate Premium', 'visualcomposer')
    );
    echo sprintf(
        '<a href="%s" class="button vcv-license-btn-activate-hub vcv-license-btn-go-premium" target="_blank" rel="noopener noreferrer">%s</a>',
        esc_url(vchelper('Utm')->get('vcdashboard-license-go-premium')),
        esc_html__('Go Premium', 'visualcomposer')
    );
    echo '</div>';

    return;
}
?>
<div class="vcv-ui-settings-status-table-container">
    <h2><?php echo esc_html__('License Information', 'visualcomposer') ?></h2>
    <div class="vcv-description">
        <p class="description">
            <?php echo esc_html__(
                'Visual Composer license information. Click refresh to check for license updates.',
                'visualcomposer'
            ); ?>
        </p>
        <a href="<?php echo esc_url($refreshUrl); ?>" class="button vcv-license-btn-refresh">
            <?php echo esc_html__(
                'Refresh',
                'visualcomposer'
            ); ?>
        </a>
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
                <td><?php echo esc_html__('License key', 'visualcomposer') ?>:</td>
                <td><?php echo esc_html(vchelper('License')->getHiddenKey()); ?> <a href="<?php
                    echo esc_url(
                        $deactivateUrl
                    ); ?>" class="vcv-license-btn-deactivate"><?php
                        echo esc_html__(
                            'Deactivate',
                            'visualcomposer'
                        ); ?></a>
                </td>
            </tr>
            <tr>
                <td><?php echo esc_html__('License type', 'visualcomposer') ?>:</td>
                <td><?php
                $licenseType = vchelper('License')->getType();
                echo esc_html(ucfirst($licenseType));
                if ($licenseType === 'free') {
                    echo sprintf(
                        ' - <a href="%s" class="vcv-license-btn-upgrade">%s</a>',
                        esc_url($upgradeLicenseUrl),
                        esc_html__(
                            'Upgrade',
                            'visualcomposer'
                        )
                    );
                }
                ?></td>
            </tr>
            <?php if (!empty($expirationDate)) : ?>
                <tr>
                    <td><?php echo esc_html__('License expiration date', 'visualcomposer') ?>:</td>
                    <td><?php
                        echo esc_html(
                            $expirationDate !== 'lifetime' ? gmdate(
                                get_option('date_format') . ' ' . get_option('time_format'),
                                $expirationDate
                            ) : 'lifetime'
                        ); ?></td>
                </tr>
            <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>
