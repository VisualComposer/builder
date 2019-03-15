<?php

namespace VisualComposer\Modules\Migrations;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\DefaultElements;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;

/**
 * @since 11.0
 * Class DefaultElementsMigration
 *
 * This migration removes default elements information from options
 *
 * @package VisualComposer\Modules\Migrations
 */
class DefaultElementsMigration extends MigrationsController implements Module
{
    use EventsFilters;

    protected $migrationId = 'defaultElementsMigration15'; // ID should be changed once defaultElements list is being changed

    protected $migrationPriority = 20;

    public function __construct()
    {
        parent::__construct();
        $this->addEvent('vcv:system:factory:reset', 'run');
    }

    protected function run(DefaultElements $defaultElementsHelper, Options $optionsHelper)
    {
        foreach ($defaultElementsHelper->all() as $element) {
            $optionsHelper->delete('hubAction:element/' . $element);
        }

        return true;
    }
}
