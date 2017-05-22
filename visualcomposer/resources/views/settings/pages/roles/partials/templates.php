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
        'options' => [
            [true, __('All', 'vcwb')],
            ['add', __('Apply templates only', 'vcwb')],
            [true, __('Disabled', 'vcwb')],
        ],
        'mainLabel' => __('Templates', 'vcwb'),
        'description' => __(
            'Control access rights to templates and predefined templates. Note: "Apply templates only" restricts users from saving new templates and deleting existing.',
            'vcwb'
        ),
    ]
);
