<?php

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

echo vcview(
    'settings/pages/roles/partials/part',
    [
        'part' => $part,
        'role' => $role,
        'paramsPrefix' => 'vc_roles[' . $role . '][' . $part . ']',
        'controller' => vchelper('AccessRole')->who($role)->part($part),
        'capabilities' => [
            ['disabled_ce_editor', __('Disable Classic editor', 'vcwb')],
        ],
        'options' => [
            [true, __('Enabled', 'vcwb')],
            ['default', __('Enabled and default', 'vcwb')],
            [true, __('Disabled', 'vcwb')],
        ],
        'mainLabel' => __('Backend editor', 'vcwb'),
        'customLabel' => __('Backend editor', 'vcwb'),
    ]
);
