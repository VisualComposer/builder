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
 * Class ActivationTimestampMigration
 *
 * This migration setup plugin activation timestamp
 *
 * @package VisualComposer\Module\Migrations
 */
class ActivationTimestampMigration extends MigrationsController implements Module
{
    protected $migrationId = 'activationTimestampMigration42';

    protected $migrationPriority = 1;

    /**
     * @param \VisualComposer\Helpers\Options $optionsHelper
     */
    protected function run(Options $optionsHelper)
    {
        $timestamp = $optionsHelper->get('activationTimestamp', 'not-exist');
        if ($timestamp === 'not-exist') {
            $optionsHelper->set('activationTimestamp', date('d/m/Y H:i:s'));
        }

        return true;
    }
}
