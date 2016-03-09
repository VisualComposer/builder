<?php

if (!defined('ABSPATH')) {
    die('-1');
}

use VisualComposer\Helpers\Generic\Templates;

Templates::render(
    'settings/pages/roles/partials/part',
    [
        'part' => $part,
        'role' => $role,
        'paramsPrefix' => 'vc_roles[' . $role . '][' . $part . ']',
        'controller' => app('VisualComposer\Modules\Access\Role\Access')->who($role)->part($part),
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
