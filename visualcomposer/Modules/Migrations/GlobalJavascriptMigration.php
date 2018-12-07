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
 * @since 11.0
 * Class GlobalJavascriptMigration
 *
 * This migration wraps GlobalJs into <script> tags
 *
 * @package VisualComposer\Modules\Migrations
 */
class GlobalJavascriptMigration extends MigrationsController implements Module
{
    protected $migrationId = 'globalJavascriptMigration';

    protected $migrationPriority = 15;

    protected function run(Options $optionsHelper)
    {
        $globalJs = trim($optionsHelper->get('settingsGlobalJs', ''));

        if (!empty($globalJs)) {
            $globalJs = '<script type="text/javascript">' . $globalJs . '</script>';
            $optionsHelper->set('settingsGlobalJsFooter', $globalJs);
            $optionsHelper->delete('settingsGlobalJs');
        }

        return true;
    }
}
