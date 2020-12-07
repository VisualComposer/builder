<?php

namespace VisualComposer\Modules\Migrations;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;

class DatabaseMigration extends MigrationsController implements Module
{
    protected $migrationPriority = 1;

    public function __construct()
    {
        // Run migration every plugin update
        $this->migrationId = 'databaseMigration-' . VCV_VERSION;
        parent::__construct();
    }

    protected function run()
    {
        global $wpdb;
        // Remove temporary download data
        $wpdb->query(
            $wpdb->prepare(
                'DELETE FROM ' . $wpdb->options . ' WHERE option_name LIKE "%s"',
                VCV_PREFIX . 'hubA:d:%'
            )
        );
        // Remove old transients
        $wpdb->query(
            $wpdb->prepare(
                'DELETE FROM ' . $wpdb->options . ' WHERE option_name LIKE "%s" and option_name NOT LIKE "%s"',
                '_transient_vcv-%',
                '_transient_vcv-' . VCV_VERSION . '%'
            )
        );
        // Remove old transient timeouts
        $wpdb->query(
            $wpdb->prepare(
                'DELETE FROM ' . $wpdb->options . ' WHERE option_name LIKE "%s" and option_name NOT LIKE "%s"',
                '_transient_timeout_vcv-%',
                '_transient_timeout_vcv-' . VCV_VERSION . '%'
            )
        );
        // Remove old DB migrations
        $wpdb->query(
            $wpdb->prepare(
                'DELETE FROM ' . $wpdb->options . ' WHERE option_name LIKE "%s" and option_name NOT LIKE "%s"',
                'vcv-system:migration:databaseMigration-%',
                'vcv-system:migration:databaseMigration-' . VCV_VERSION
            )
        );
        // Remove before 1.13 keys temporary download data
        $wpdb->query(
            $wpdb->prepare(
                'DELETE FROM ' . $wpdb->options . ' WHERE option_name LIKE "%s"',
                VCV_PREFIX . 'hubAction:download:%'
            )
        );

        return true;
    }
}
