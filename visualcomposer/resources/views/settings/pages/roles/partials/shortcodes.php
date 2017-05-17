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
        'customValue' => 'custom',
        'capabilities' => [],
        // TODO: add shortcodes
        'ignoreCapabilities' => [
            'vc_gitem',
            'vc_gitem_animated_block',
            'vc_gitem_zone',
            'vc_gitem_zone_a',
            'vc_gitem_zone_b',
            'vc_gitem_zone_c',
            'vc_column',
            'vc_row_inner',
            'vc_column_inner',
            'vc_posts_grid',
        ],
        'categories' => [],
        // TODO: add shortcodes
        'capTypes' => [
            [
                'all',
                __('All', 'vcwb'),
            ],
            [
                'edit',
                __('Edit', 'vcwb'),
            ],
        ],
        'itemHeaderName' => __('Element', 'vcwb'),
        'options' => [
            [
                true,
                __('All', 'vcwb'),
            ],
            [
                'edit',
                __('Edit only', 'vcwb'),
            ],
            [
                'custom',
                __('Custom', 'vcwb'),
            ],
        ],
        'mainLabel' => __('Elements', 'vcwb'),
        'customLabel' => __('Elements', 'vcwb'),
        'description' => __('Control user access to content elements.', 'vcwb'),
        'useTable' => true,
    ]
);
