<?php

namespace VisualComposer\Modules\Migrations;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\License;
use VisualComposer\Helpers\Options;

/**
 * Class LicenseMigration
 *
 * This migration setup license type for licenses
 *
 * @package VisualComposer\Modules\Migrations
 */
class LicenseMigration extends MigrationsController implements Module
{
    protected $migrationId = 'licenseMigrationV24';

    protected $migrationPriority = 11;

    protected function run(License $licenseHelper, Options $optionsHelper)
    {
        $key = $licenseHelper->getKey();
        if (!empty($key)) {
            $type = $licenseHelper->getType();
            if (empty($type)) {
                // If no type then it is premium license
                $licenseHelper->setType('premium');
                $optionsHelper->deleteTransient('lastBundleUpdate');
            }
        }

        return true;
    }
}
