<?php

if (!defined('ABSPATH')) {
    die('-1');
}

vcview(
    'settings/pages/roles/partials/part',
    [
        'part' => $part,
        'role' => $role,
        'paramsPrefix' => 'vc_roles[' . $role . '][' . $part . ']',
        'controller' => vchelper('AccessRole')->who($role)->part($part),
        'capabilities' => [
            ['disabled_ce_editor', __('Disable Classic editor', 'vc5')],
        ],
        'options' => [
            [true, __('Enabled', 'vc5')],
            ['default', __('Enabled and default', 'vc5')],
            [true, __('Disabled', 'vc5')],
        ],
        'mainLabel' => __('Backend editor', 'vc5'),
        'customLabel' => __('Backend editor', 'vc5'),
    ]
);
