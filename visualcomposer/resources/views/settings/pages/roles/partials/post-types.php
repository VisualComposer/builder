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
        'controller' => vchelper('roleAccess')->who($role)->part($part),
        'customValue' => 'custom',
        'capabilities' => $controller->getPostTypes(),
        'options' => [
            ['1', __('Pages only', 'vc5')],
            ['custom', __('Custom', 'vc5')],
            ['0', __('Disabled', 'vc5')],
        ],
        'mainLabel' => __('Post types', 'vc5'),
        'customLabel' => __('Post types', 'vc5'),
        'description' => __(
            'Enable Visual Composer for pages, posts and custom post types. Note: By default Visual Composer is available for pages only.',
            'vc5'
        ),
    ]
);
