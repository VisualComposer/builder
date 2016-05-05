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
            [true, __('All', 'vc5')],
            ['add', __('Apply presets only', 'vc5')],
            [true, __('Disabled', 'vc5')],
        ],
        'mainLabel' => __('Element Presets', 'vc5'),
        'description' => __(
            'Control access rights to element presets in element edit form. Note: "Apply presets only" restricts users from saving new presets, deleting existing and setting defaults.',
            'vc5'
        ),
    ]
);
