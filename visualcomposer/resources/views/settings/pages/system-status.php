<?php

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

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
            <td>Test</td>
            <td>Test</td>
        </tr>
        <tr>
            <td>Test</td>
            <td>Test</td>
        </tr>
        <tr>
            <td>Test</td>
            <td>Test</td>
        </tr>
        <tr>
            <td>Test</td>
            <td>Test</td>
        </tr>
        <tr>
            <td>Test</td>
            <td>Test</td>
        </tr>
    </tbody>
</table>
