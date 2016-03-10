<?php

if (!defined('ABSPATH')) {
    die('-1');
}

vcapp('VisualComposer\Helpers\Generic\Templates')->render(
    'settings/pages/roles/partials/part',
    [
        'part' => $part,
        'role' => $role,
        'paramsPrefix' => 'vc_roles[' . $role . '][' . $part . ']',
        'controller' => vcapp('VisualComposer\Modules\Access\Role\Access')->who($role)->part($part),
        'options' => [
            [true, __('All', 'vc5')],
            ['add', __('Apply templates only', 'vc5')],
            [true, __('Disabled', 'vc5')],
        ],
        'mainLabel' => __('Templates', 'vc5'),
        'description' => __(
            'Control access rights to templates and predefined templates. Note: "Apply templates only" restricts users from saving new templates and deleting existing.',
            'vc5'
        ),
    ]
);
