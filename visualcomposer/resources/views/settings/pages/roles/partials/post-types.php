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
        'customValue' => 'custom',
        'capabilities' => $controller->getPostTypes(),
        'options' => [
            ['1', __('Pages only', 'vcwb')],
            ['custom', __('Custom', 'vcwb')],
            ['0', __('Disabled', 'vcwb')],
        ],
        'mainLabel' => __('Post types', 'vcwb'),
        'customLabel' => __('Post types', 'vcwb'),
        'description' => __(
            'Enable Visual Composer for pages, posts and custom post types. Note: By default Visual Composer is available for pages only.',
            'vcwb'
        ),
    ]
);
