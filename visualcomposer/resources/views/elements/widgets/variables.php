<?php
if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

$wpWidgets = vchelper('WpWidgets');
$groups = $wpWidgets->allGrouped();
if (!empty($groups['wpWidgetsCustom'])) {
    $variables = $wpWidgets->getTemplateVariables([], $groups['wpWidgetsCustom']);
    echo sprintf('window.vcvCustomWidgets=%s;', json_encode($variables['widgets']));
} else {
    echo sprintf(
        'window.vcvCustomWidgets=%s;',
        json_encode(
            [
                [
                    'label' => __('No Custom widgets found', 'vcwb'),
                    'value' => '',
                ],
            ]
        )
    );
}

if (!empty($groups['wpWidgetsDefault'])) {
    $variables = $wpWidgets->getTemplateVariables([], $groups['wpWidgetsDefault']);
    echo sprintf('window.vcvDefaultWidgets=%s;', json_encode($variables['widgets']));
} else {
    echo sprintf(
        'window.vcvCustomWidgets=%s;',
        json_encode(
            [
                [
                    'label' => __('No Widgets found', 'vcwb'),
                    'value' => '',
                ],
            ]
        )
    );
}
