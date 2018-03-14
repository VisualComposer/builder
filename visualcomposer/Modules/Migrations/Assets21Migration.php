<?php

namespace VisualComposer\Modules\Migrations;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\File;

/**
 * Class Templates114Migration
 *
 * This migration fixes the template downloaded images
 *
 * @package VisualComposer\Modules\Migrations
 */
class Assets21Migration extends MigrationsController implements Module
{
    protected $migrationId = 'assets21Migration';

    protected $migrationPriority = 1;

    protected function run(File $fileHelper)
    {
        // check if folder doesnt exists in wp-content/uploads/visualcomposer-assets
        // check if folder exists in wp-content/visualcomposer-assets
        if (vcvenv('VCV_TF_ASSETS_IN_UPLOADS')) {
            $fileSystem = $fileHelper->getFileSystem();
            if (!$fileSystem->is_dir(VCV_PLUGIN_ASSETS_DIR_PATH)
                && $fileSystem->is_dir(
                    WP_CONTENT_DIR . '/' . VCV_PLUGIN_ASSETS_DIRNAME
                )) {
                $fileHelper->copyDirectory(
                    WP_CONTENT_DIR . '/' . VCV_PLUGIN_ASSETS_DIRNAME,
                    VCV_PLUGIN_ASSETS_DIR_PATH,
                    false
                );
            }
        }
    }
}
