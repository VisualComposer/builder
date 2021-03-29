<?php

namespace VisualComposer\Modules\Migrations;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;

class DefaultCapabilitiesMigration extends MigrationsController implements Module
{
    protected $migrationId = 'defaultCapabilitiesMigrationv38';

    protected $migrationPriority = 1;

    protected function run()
    {
        $roleHelper = vchelper('AccessRole');

        $defaultCapabilities = [
            'editor' => [
                'dashboard' => [
                    'addon_global_templates',
                    'addon_popup_builder',
                    'settings_custom_html',
                ],
                'hub' => [
                    'elements_templates_blocks',
                    'unsplash',
                    'giphy',
                ],
                'editor_settings' => [
                    'page',
                    'popup',
                ]
            ],
            'author' => [
                'hub' => [
                    'unsplash',
                    'giphy',
                ],
                'editor_settings' => [
                    'page',
                    'popup',
                ]
            ],
            'contributor' => [
                'editor_settings' => [
                    'page'
                ]
            ]
        ];

        foreach ($defaultCapabilities as $roleName => $roleParts) {
            foreach ($roleParts as $capPart => $capabilities) {
                foreach ($capabilities as $cap) {
                    $roleHelper->who($roleName)->part($capPart)->setCapRule($cap, true);
                }
            }
        }

        return true;
    }
}
