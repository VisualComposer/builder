<?php

if (!defined('ABSPATH')) {
    die('-1');
}

echo vcview(
    'settings/pages/roles/partials/part',
    [
        'part' => $part,
        'role' => $role,
        'paramsPrefix' => 'vc_roles[' . $role . '][' . $part . ']',
        'controller' => vchelper('AccessRole')->who($role)->part($part),
        'options' => [
            [true, __('Enabled', 'vcwb')],
            [true, __('Disabled', 'vcwb')],
        ],
        'mainLabel' => __('Page settings', 'vcwb'),
        'description' => __(
            'Control access to Visual Composer page settings. Note: Disable page settings to restrict editing of Custom CSS through a page.',
            'vcwb'
        ),
    ]
);
