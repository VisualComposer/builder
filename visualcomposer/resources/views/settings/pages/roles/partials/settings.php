<?php

if (!defined('ABSPATH')) {
    die('-1');
}


$tabs = [];
foreach (vcapp('VisualComposer\Modules\Settings\Controller')->getPages() as $tab) {
    $tabs[] = [$tab['slug'] . '-tab', $tab['title']];
}

vcapp('VisualComposer\Helpers\Generic\Templates')->render(
    'settings/pages/roles/partials/part',
    [
        'part' => $part,
        'role' => $role,
        'paramsPrefix' => 'vc_roles[' . $role . '][' . $part . ']',
        'controller' => vcapp('VisualComposer\Modules\Access\Role\Access')->who($role)->part($part),
        'customValue' => 'custom',
        'capabilities' => $tabs,
        'options' => [
            [true, __('All', 'vc5')],
            ['custom', __('Custom', 'vc5')],
            [true, __('Disabled', 'vc5')],
        ],
        'mainLabel' => __('Settings options', 'vc5'),
        'customLabel' => __('Settings options', 'vc5'),
        'description' => __(
            'Control access rights to Visual Composer admin settings tabs (e.g. General Settings, Shortcode Mapper, ...)',
            'vc5'
        ),
    ]
);
