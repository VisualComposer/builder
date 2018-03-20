<?php

namespace VisualComposer\Modules\Migrations;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class MigrationsController extends Container
{
    use WpFiltersActions;

    protected $migrationId = '';

    protected $migrationPriority = 0;

    public function __construct()
    {
        if (!empty($this->migrationPriority) && !empty($this->migrationId)) {
            $this->wpAddAction('init', 'init', $this->migrationPriority);
        }
    }

    protected function init(Options $optionsHelper)
    {
        if (!$optionsHelper->get('system:migration:' . $this->migrationId) && method_exists($this, 'run')) {
            $status = $this->call('run');
            if ($status) {
                $optionsHelper->set('system:migration:' . $this->migrationId, true);
            }
        }

        return true;
    }
}
