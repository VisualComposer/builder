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
        'controller' => vcapp('roleAccessHelper')->who($role)->part($part),
        'customValue' => 'custom',
        'capabilities' => [],
        // @todo add shortcodes
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
        // @todo add shortcodes
        'capTypes' => [
            [
                'all',
                __('All', 'vc5'),
            ],
            [
                'edit',
                __('Edit', 'vc5'),
            ],
        ],
        'itemHeaderName' => __('Element', 'vc5'),
        'options' => [
            [
                true,
                __('All', 'vc5'),
            ],
            [
                'edit',
                __('Edit only', 'vc5'),
            ],
            [
                'custom',
                __('Custom', 'vc5'),
            ],
        ],
        'mainLabel' => __('Elements', 'vc5'),
        'customLabel' => __('Elements', 'vc5'),
        'description' => __('Control user access to content elements.', 'vc5'),
        'useTable' => true,
    ]
);
