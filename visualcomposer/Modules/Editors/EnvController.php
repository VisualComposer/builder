<?php

namespace VisualComposer\Modules\Editors;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;

class EnvController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        $this->addFilter('vcv:editor:variables', 'outputEnv');
    }

    protected function outputEnv($variables)
    {
        $variables[] = [
            'type' => 'constant',
            'key' => 'VCV_ENV',
            'value' => \VcvEnv::all(),
        ];

        return $variables;
    }
}
