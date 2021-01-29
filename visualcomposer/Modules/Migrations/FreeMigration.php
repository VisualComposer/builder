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

class FreeMigration extends MigrationsController implements Module
{
    protected $migrationId = 'freeMigrationV34';

    protected $migrationPriority = 1;

    protected function run(License $licenseHelper, Options $optionsHelper)
    {
        $key = $licenseHelper->getKey();
        $time = time();
        if (!empty($key)) {
            $type = $licenseHelper->getType();
            if ($type === 'free') {
                // Remove free licenses as it is not used anymore
                $licenseHelper->setKey('');
                $licenseHelper->setType('');
                $usage = $optionsHelper->get('license-usage');
                if (!empty($usage) && is_numeric($usage)) {
                    $time = $usage;
                }
                $optionsHelper->set('agreeHubTerms', $time);
            }
        }
        $optionsHelper->set('plugin-activation', $time);

        return true;
    }
}
