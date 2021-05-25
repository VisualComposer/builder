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
        // Run migration only if role Manager addon is available and is enabled
        if (vcvenv('VCV_ADDON_ROLE_MANAGER_PARTS')) {
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
                    ],
                    'editor_content' => [
                        'element_add',
                        'template_add',
                        'user_templates_management',
                        'hub_templates_management',
                        'presets_management',
                    ],
                ],
                'author' => [
                    'hub' => [
                        'unsplash',
                        'giphy',
                    ],
                    'editor_settings' => [
                        'page',
                        'popup',
                    ],
                    'editor_content' => [
                        'element_add',
                        'template_add',
                    ],
                ],
                'contributor' => [
                    'editor_settings' => [
                        'page',
                    ],
                    'editor_content' => [
                        'element_add',
                        'template_add',
                    ],
                ],
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
}
