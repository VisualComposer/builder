<?php

namespace VisualComposer\Modules\Migrations;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\File;
use VisualComposer\Helpers\Options;

/**
 * Class Templates114Migration
 *
 * This migration fixes the template downloaded images
 *
 * @package VisualComposer\Modules\Migrations
 */
class Assets22Migration extends MigrationsController implements Module
{
    protected $migrationId = 'assets22Migration';

    protected $migrationPriority = 11;

    protected function run(File $fileHelper, Options $optionsHelper)
    {
        // check if folder doesnt exists in wp-content/uploads/visualcomposer-assets
        // check if folder exists in wp-content/visualcomposer-assets
        $fileSystem = $fileHelper->getFileSystem();
        if (!$fileSystem) {
            return false;
        }
        if (
            !$fileSystem->is_dir(VCV_PLUGIN_ASSETS_DIR_PATH)
            && $fileSystem->is_dir(
                WP_CONTENT_DIR . '/' . VCV_PLUGIN_ASSETS_DIRNAME
            )
        ) {
            usleep(500000);
            if (!$optionsHelper->getTransient('vcv:migration:assets22:lock')) {
                /** @see \VisualComposer\Modules\Migrations\Assets22Migration::moveFiles */
                return $this->call('moveFiles');
            } else {
                return false;
            }
        }

        return true;
    }

    /**
     * @param \VisualComposer\Helpers\File $fileHelper
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return bool
     */
    protected function moveFiles(File $fileHelper, Options $optionsHelper)
    {
        //@codingStandardsIgnoreStart
        $optionsHelper->setTransient('vcv:migration:assets22:lock', true, 20);

        $result = $fileHelper->copyDirectory(
            WP_CONTENT_DIR . '/' . VCV_PLUGIN_ASSETS_DIRNAME,
            VCV_PLUGIN_ASSETS_DIR_PATH . '-temp',
            true
        );
        if (!is_wp_error($result) && $result) {
            $resultMove = $fileHelper->getFileSystem()->move(
                VCV_PLUGIN_ASSETS_DIR_PATH . '-temp',
                VCV_PLUGIN_ASSETS_DIR_PATH
            );
            $responseMove = !is_wp_error($resultMove) && $result;

            return $responseMove;
        }

        return false;
        //@codingStandardsIgnoreEnd
    }
}
