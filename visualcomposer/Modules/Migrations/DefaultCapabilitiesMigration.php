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
        if (!vcvenv('VCV_ADDON_ROLE_MANAGER_PARTS')) {
            return false;
        }

        $roleHelper = vchelper('AccessRole');
        $userCapabilitiesHelper = vchelper('AccessUserCapabilities');
        $defaultCapabilities = $userCapabilitiesHelper->getDefaultCapabilities();

        // for a security reason we decided to remove all default caps in some user roles.
        $roleWithoutDefaultCaps = ['author', 'contributor'];

        foreach ($defaultCapabilities as $roleName => $roleParts) {
            if (in_array($roleName, $roleWithoutDefaultCaps)) {
                continue;
            }

            foreach ($roleParts as $capPart => $capabilities) {
                foreach ($capabilities as $cap) {
                    $roleHelper->who($roleName)->part($capPart)->setCapRule($cap);
                }
            }
        }

        return true;
    }
}
