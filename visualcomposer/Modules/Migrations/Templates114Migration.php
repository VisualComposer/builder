<?php

namespace VisualComposer\Modules\Migrations;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;

/**
 * Class Templates114Migration
 *
 * This migration fixes the template downloaded images
 *
 * @package VisualComposer\Modules\Migrations
 */
class Templates114Migration extends MigrationsController implements Module
{
    protected $migrationId = 'templates114Migration';

    protected $migrationPriority = 2;

    protected function run()
    {
        global $wpdb;
        $wpdb->query(
            $wpdb->prepare(
                'UPDATE ' . $wpdb->options . ' SET option_value="0.0.1" WHERE option_name LIKE %s',
                VCV_PREFIX . 'hubAction:predefinedTemplate/%'
            )
        );
        $wpdb->query(
            $wpdb->prepare(
                'UPDATE ' . $wpdb->options . ' SET option_value="0.0.1" WHERE option_name LIKE %s',
                VCV_PREFIX . 'hubAction:template/%'
            )
        );

        return true;
    }
}
