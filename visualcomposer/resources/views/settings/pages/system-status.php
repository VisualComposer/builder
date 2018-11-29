<?php

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

/** @var array $wpVersion */
/** @var array $phpVersion */
/** @var array $wpDebug */
/** @var string $vcVersion */
/** @var array $memoryLimit */
/** @var array $timeout */
/** @var array $fileUploadSize */
/** @var array $uploadDirAccess */
/** @var array $fsMethod */
/** @var array $zipExt */
/** @var array $curlExt */
/** @var array $account */
/** @var array $aws */
?>
<div class="vcv-ui-settings-status-table-container">
    <h2><?php echo esc_html__('System status', 'vcwb') ?></h2>
    <table class="vcv-ui-settings-status-table">
        <thead>
        <tr>
            <th colspan="3"><?php echo esc_html__('WordPress environment', 'vcwb') ?></th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td><?php echo esc_html__('WordPress Version', 'vcwb') ?>:</td>
            <td class="vcv-help">
                <span class="vcv-help-tooltip-icon"></span>
                <span class="vcv-help-tooltip">
                        <?php echo esc_html__('The version of WordPress installed on your site', 'vcwb') ?>
                    </span>
            </td>
            <td class="<?php echo $wpVersion['status'] ?>"><?php echo $wpVersion['text']; ?></td>
        </tr>
        <tr>
            <td><?php echo esc_html__('PHP Version', 'vcwb') ?>:</td>
            <td class="vcv-help">
                <span class="vcv-help-tooltip-icon"></span>
                <span class="vcv-help-tooltip">
                        <?php echo esc_html__('The version of PHP installed on your hosting server', 'vcwb') ?>
                    </span>
            </td>
            <td class="<?php echo $phpVersion['status'] ?>"><?php echo $phpVersion['text']; ?></td>
        </tr>
        <tr>
            <td><?php echo esc_html__('WP_DEBUG', 'vcwb') ?>:</td>
            <td class="vcv-help">
                <span class="vcv-help-tooltip-icon"></span>
                <span class="vcv-help-tooltip">
                        <?php echo esc_html__('Displays whether of not WordPress is in Debug Mode', 'vcwb') ?>
                    </span>
            </td>
            <td class="<?php echo $wpDebug['status'] ?>"><?php echo $wpDebug['text'] ?></td>
        </tr>
        <tr>
            <td><?php echo esc_html__('Visual Composer Version', 'vcwb') ?>:</td>
            <td class="vcv-help">
                <span class="vcv-help-tooltip-icon"></span>
                <span class="vcv-help-tooltip">
                        <?php echo esc_html__('The version of Visual Composer installed on your site', 'vcwb') ?>
                    </span>
            </td>
            <td><?php echo $vcVersion; ?></td>
        </tr>
        </tbody>
    </table>

    <table class="vcv-ui-settings-status-table">
        <thead>
        <tr>
            <th colspan="3"><?php echo esc_html__('Configurations', 'vcwb') ?></th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td><?php echo esc_html__('Memory Limit', 'vcwb') ?>:</td>
            <td class="vcv-help">
                <span class="vcv-help-tooltip-icon"></span>
                <span class="vcv-help-tooltip">
                        <?php echo esc_html__(
                            'The maximum amout of memory (RAM) that your site can use at one time',
                            'vcwb'
                        ) ?>
                    </span>
            </td>
            <td class="<?php echo $memoryLimit['status'] ?>"><?php echo $memoryLimit['text']; ?></td>
        </tr>
        <tr>
            <td><?php echo esc_html__('Timeout', 'vcwb') ?>:</td>
            <td class="vcv-help">
                <span class="vcv-help-tooltip-icon"></span>
                <span class="vcv-help-tooltip">
                        <?php echo esc_html__('Amount of max execution time', 'vcwb') ?>
                    </span>
            </td>
            <td class="<?php echo $timeout['status'] ?>"><?php echo $timeout['text']; ?></td>
        </tr>
        <tr>
            <td><?php echo esc_html__('Upload Max Filesize', 'vcwb') ?>:</td>
            <td class="vcv-help">
                <span class="vcv-help-tooltip-icon"></span>
                <span class="vcv-help-tooltip">
                        <?php echo esc_html__(
                            'The largest filesize that can be uploaded to your WordPress installation',
                            'vcwb'
                        ) ?>
                    </span>
            </td>
            <td class="<?php echo $fileUploadSize['status'] ?>"><?php echo $fileUploadSize['text']; ?></td>
        </tr>
        <tr>
            <td><?php echo esc_html__('Access to Uploads Directory', 'vcwb') ?>:</td>
            <td class="vcv-help">
                <span class="vcv-help-tooltip-icon"></span>
                <span class="vcv-help-tooltip">
                        <?php echo esc_html__(
                            'Visual Composer stores assets in the WordPress uploads directory. The directory must be writable for this to happen.',
                            'vcwb'
                        ) ?>
                    </span>
            </td>
            <td class="<?php echo $uploadDirAccess['status'] ?>"><?php echo $uploadDirAccess['text']; ?></td>
        </tr>
        <tr>
            <td><?php echo esc_html__('File System Method', 'vcwb') ?>:</td>
            <td class="vcv-help">
                <span class="vcv-help-tooltip-icon"></span>
                <span class="vcv-help-tooltip">
                        <?php echo esc_html__('The File System method should be direct', 'vcwb') ?>
                    </span>
            </td>
            <td class="<?php echo $fsMethod['status'] ?>"><?php echo $fsMethod['text']; ?></td>
        </tr>
        </tbody>
    </table>

    <table class="vcv-ui-settings-status-table">
        <thead>
        <tr>
            <th colspan="3"><?php echo esc_html__('Extensions', 'vcwb') ?></th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td><?php echo esc_html__('Zip Extension', 'vcwb') ?>:</td>
            <td class="vcv-help">
                <span class="vcv-help-tooltip-icon"></span>
                <span class="vcv-help-tooltip">
                        <?php echo esc_html__('The Zip Extension should be enabled on your server', 'vcwb') ?>
                    </span>
            </td>
            <td class="<?php echo $zipExt['status'] ?>"><?php echo $zipExt['text']; ?></td>
        </tr>
        <tr>
            <td><?php echo esc_html__('Curl Extension', 'vcwb') ?>:</td>
            <td class="vcv-help">
                <span class="vcv-help-tooltip-icon"></span>
                <span class="vcv-help-tooltip">
                        <?php echo esc_html__('The version of cURL installed on your server', 'vcwb') ?>
                    </span>
            </td>
            <td class="<?php echo $curlExt['status'] ?>"><?php echo $curlExt['text']; ?></td>
        </tr>
        </tbody>
    </table>

    <table class="vcv-ui-settings-status-table">
        <thead>
        <tr>
            <th colspan="3"><?php echo esc_html__('Connections', 'vcwb') ?></th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td><?php echo esc_html__('Account', 'vcwb') ?>:</td>
            <td class="vcv-help">
                <span class="vcv-help-tooltip-icon"></span>
                <span class="vcv-help-tooltip">
                        <?php echo esc_html__('Connection with the Account', 'vcwb') ?>
                    </span>
            </td>
            <td class="<?php echo $account['status'] ?>"><?php echo $account['text']; ?></td>
        </tr>
        <tr>
            <td><?php echo esc_html__('AWS', 'vcwb') ?>:</td>
            <td class="vcv-help">
                <span class="vcv-help-tooltip-icon"></span>
                <span class="vcv-help-tooltip">
                        <?php echo esc_html__('The connection with the AWS', 'vcwb') ?>
                    </span>
            </td>
            <td class="<?php echo $aws['status'] ?>"><?php echo $aws['text']; ?></td>
        </tr>
        </tbody>
    </table>
</div>
