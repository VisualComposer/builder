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
?>

<h2><?php echo esc_html__('System status', 'vcwb') ?></h2>
<table class="vcv-ui-settings-status-table">
    <thead>
    <tr>
        <th>Check</th>
        <th>Status</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td><?php echo esc_html__('WordPress Version', 'vcwb') ?></td>
        <td class="<?php echo $wpVersion['status'] ?>"><?php echo $wpVersion['text']; ?></td>
    </tr>
    <tr>
        <td><?php echo esc_html__('PHP Version', 'vcwb') ?></td>
        <td class="<?php echo $phpVersion['status'] ?>"><?php echo $phpVersion['text']; ?></td>
    </tr>
    <tr>
        <td><?php echo esc_html__('WP_DEBUG', 'vcwb') ?></td>
        <td class="<?php echo $wpDebug['status'] ?>"><?php echo $wpDebug['text'] ?></td>
    </tr>
    <tr>
        <td><?php echo esc_html__('Visual Composer Version', 'vcwb') ?></td>
        <td><?php echo $vcVersion; ?></td>
    </tr>
    <tr>
        <td>Test</td>
        <td>Test</td>
    </tr>
    </tbody>
</table>
