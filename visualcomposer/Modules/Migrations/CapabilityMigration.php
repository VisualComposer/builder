<?php

namespace VisualComposer\Modules\Migrations;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;

class CapabilityMigration extends MigrationsController implements Module
{
    protected $migrationPriority = 1;

    protected $migrationId = 'capabilityMigrationV36';

    protected function run()
    {
        // @codingStandardsIgnoreLine
        global $wp_roles;
        // @codingStandardsIgnoreLine
        $wpRoles = $wp_roles;
        $optionsHelper = vchelper('Options');

        $postTypes = [
            'vcv_headers',
            'vcv_footers',
            'vcv_sidebars',
            'vcv_templates',
            'vcv_tutorials',
            'vcv_archives',
            'vcv_popups',
            'vcv_layouts',
        ];
        foreach ($postTypes as $postType) {
            $optionsHelper->delete($postType . '-capabilities-set');
            $wpRoles->remove_cap('contributor', 'read_' . $postType);
            $wpRoles->remove_cap('contributor', 'edit_' . $postType);
            $wpRoles->remove_cap('contributor', 'delete_' . $postType);
            $wpRoles->remove_cap('contributor', 'edit_' . $postType . 's');
            $wpRoles->remove_cap('contributor', 'delete_' . $postType . 's');
        }

        return true;
    }
}
