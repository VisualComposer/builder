<?php

namespace VisualComposer\Modules\Migrations;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;

/**
 * Migration due to move maintenance addon to free plugin version.
 */
class MaintenanceModeMigration extends MigrationsController implements Module
{
    protected $migrationId = 'mergeArchivesLayoutsMigrationv43';

    protected $migrationPriority = 10;

    /**
     * Main migration action.
     *
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return bool
     */
    protected function run(Options $optionsHelper)
    {
        $currentDbValue = $optionsHelper->get('hubAction:addon/maintenanceMode', '');

        if ($currentDbValue) {
            $optionsHelper->delete('hubAction:addon/maintenanceMode');
        }

        $optionsHelper->deleteTransient('addons:autoload:all');

        $hubAddonsList = $optionsHelper->get('hubAddons');

        unset($hubAddonsList['maintenanceMode']);

        $optionsHelper->set('hubAddons', $hubAddonsList);

        return true;
    }
}
