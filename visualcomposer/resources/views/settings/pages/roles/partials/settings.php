<?php

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

$tabs = [];
foreach (vcapp('SettingsController')->getPages() as $tab) {
    $tabs[] = [$tab['slug'] . '-tab', $tab['title']];
}

echo vcview(
    'settings/pages/roles/partials/part',
    [
        'part' => $part,
        'role' => $role,
        'paramsPrefix' => 'vc_roles[' . $role . '][' . $part . ']',
        'controller' => vchelper('AccessRole')->who($role)->part($part),
        'customValue' => 'custom',
        'capabilities' => $tabs,
        'options' => [
            [true, __('All', 'vcwb')],
            ['custom', __('Custom', 'vcwb')],
            [true, __('Disabled', 'vcwb')],
        ],
        'mainLabel' => __('Settings options', 'vcwb'),
        'customLabel' => __('Settings options', 'vcwb'),
        'description' => __(
            'Control access rights to Visual Composer admin settings tabs (e.g. General Settings, Shortcode Mapper, ...)',
            'vcwb'
        ),
    ]
);
