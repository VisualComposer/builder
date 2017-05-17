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
            [true, __('All', 'vcwb')],
            ['add', __('Apply presets only', 'vcwb')],
            [true, __('Disabled', 'vcwb')],
        ],
        'mainLabel' => __('Element Presets', 'vcwb'),
        'description' => __(
            'Control access rights to element preset in element edit form. Note: "Apply presets only" restricts users from saving new presets, deleting existing and setting defaults.',
            'vcwb'
        ),
    ]
);
