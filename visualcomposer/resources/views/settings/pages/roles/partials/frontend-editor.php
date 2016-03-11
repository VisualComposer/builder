<?php

if (!defined('ABSPATH')) {
    die('-1');
}

vcapp('templatesHelper')->render(
    'settings/pages/roles/partials/part',
    [
        'part' => $part,
        'role' => $role,
        'paramsPrefix' => 'vc_roles[' . $role . '][' . $part . ']',
        'controller' => vcapp('roleAccessHelper')->who($role)->part($part),
        'customValue' => 'custom',
        'options' => [
            [true, __('Enabled', 'vc5')],
            [true, __('Disabled', 'vc5')],
        ],
        'mainLabel' => __('Frontend editor', 'vc5'),
        'customLabel' => __('Frontend editor', 'vc5'),
    ]
);
