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

    /**
     * ID should be changed once defaultElements list is being changed
     * @var string
     */
    protected $migrationId = 'defaultElementsMigration36';

    /**
     * @var int
     */
    protected $migrationPriority = 20;

    /**
     * DefaultElementsMigration constructor.
     */
    public function __construct()
    {
        parent::__construct();
        $this->addEvent('vcv:system:factory:reset', 'run');
    }

    /**
     * Remove updates and database entries for default elements
     *
     * @param \VisualComposer\Helpers\DefaultElements $defaultElementsHelper
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return bool
     */
    protected function run(DefaultElements $defaultElementsHelper, Options $optionsHelper)
    {
        $dbElements = $optionsHelper->get('hubElements', []);
        if (!is_array($dbElements)) {
            $dbElements = [];
        }

        foreach ($defaultElementsHelper->all() as $element) {
            $optionsHelper->delete('hubAction:element/' . $element);

            // Remove default elements from Database
            if (array_key_exists($element, $dbElements)) {
                unset($dbElements[ $element ]);
            }
        }

        $optionsHelper->set('hubElements', $dbElements);

        return true;
    }
}
