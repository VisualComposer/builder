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
?>
<div class="vcv-ui-settings-status-table-container">
<h2><?php echo esc_html__('System status', 'vcwb') ?></h2>
<table class="vcv-ui-settings-status-table">
    <thead>
    <tr>
        <th><?php echo esc_html__('Check', 'vcwb') ?></th>
        <th>Info</th>
        <th><?php echo esc_html__('Status', 'vcwb') ?></th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td><?php echo esc_html__('WordPress Version', 'vcwb') ?>:</td>
        <td class="vcv-help">
            <span class="vcv-help-tooltip-icon"></span>
            <span class="vcv-help-tooltip">WordPress Version</span>
        </td>
        <td class="<?php echo $wpVersion['status'] ?>"><?php echo $wpVersion['text']; ?></td>
    </tr>
    <tr>
        <td><?php echo esc_html__('PHP Version', 'vcwb') ?>:</td>
        <td class="vcv-help">
            <span class="vcv-help-tooltip-icon"></span>
            <span class="vcv-help-tooltip">PHP Version</span>
        </td>
        <td class="<?php echo $phpVersion['status'] ?>"><?php echo $phpVersion['text']; ?></td>
    </tr>
    <tr>
        <td><?php echo esc_html__('WP_DEBUG', 'vcwb') ?>:</td>
        <td class="vcv-help">
            <span class="vcv-help-tooltip-icon"></span>
            <span class="vcv-help-tooltip">WP_DEBUG</span>
        </td>
        <td class="<?php echo $wpDebug['status'] ?>"><?php echo $wpDebug['text'] ?></td>
    </tr>
    <tr>
        <td><?php echo esc_html__('Visual Composer Version', 'vcwb') ?>:</td>
        <td class="vcv-help">
            <span class="vcv-help-tooltip-icon"></span>
            <span class="vcv-help-tooltip">Visual Composer Version</span>
        </td>
        <td><?php echo $vcVersion; ?></td>
    </tr>
    <tr>
        <td><?php echo esc_html__('Memory Limit', 'vcwb') ?>:</td>
        <td class="vcv-help">
            <span class="vcv-help-tooltip-icon"></span>
            <span class="vcv-help-tooltip">Memory Limit</span>
        </td>
        <td class="<?php echo $memoryLimit['status'] ?>"><?php echo $memoryLimit['text']; ?></td>
    </tr>
    <tr>
        <td><?php echo esc_html__('Timeout', 'vcwb') ?>:</td>
        <td class="vcv-help">
            <span class="vcv-help-tooltip-icon"></span>
            <span class="vcv-help-tooltip">Timeout</span>
        </td>
        <td class="<?php echo $timeout['status'] ?>"><?php echo $timeout['text']; ?></td>
    </tr>
    <tr>
        <td><?php echo esc_html__('Upload Max Filesize', 'vcwb') ?>:</td>
        <td class="vcv-help">
            <span class="vcv-help-tooltip-icon"></span>
            <span class="vcv-help-tooltip">Upload Max Filesize</span>
        </td>
        <td class="<?php echo $fileUploadSize['status'] ?>"><?php echo $fileUploadSize['text']; ?></td>
    </tr>
    <tr>
        <td><?php echo esc_html__('Access to Uploads Directory', 'vcwb') ?>:</td>
        <td class="vcv-help">
            <span class="vcv-help-tooltip-icon"></span>
            <span class="vcv-help-tooltip">Access to Uploads Directory</span>
        </td>
        <td class="<?php echo $uploadDirAccess['status'] ?>"><?php echo $uploadDirAccess['text']; ?></td>
    </tr>
    <tr>
        <td><?php echo esc_html__('File System Method', 'vcwb') ?>:</td>
        <td class="vcv-help">
            <span class="vcv-help-tooltip-icon"></span>
            <span class="vcv-help-tooltip">File Sysem method</span>
        </td>
        <td class="<?php echo $fsMethod['status'] ?>"><?php echo $fsMethod['text']; ?></td>
    </tr>
    <tr>
        <td>Test:</td>
        <td class="vcv-help">
            <span class="vcv-help-tooltip-icon"></span>
            <span class="vcv-help-tooltip">Test</span>
        </td>
        <td>Test</td>
    </tr>
    </tbody>
</table>
</div>
