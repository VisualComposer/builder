<?php

namespace VisualComposer\Modules\License;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Hub\Update;
use VisualComposer\Helpers\Traits\EventsFilters;

class UpdateVariablesController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        if (!vcvenv('VCV_FT_ACTIVATION_REDESIGN')) {
            return;
        }

        $this->addFilter('vcv:license:variables', 'addVariables');
    }

    protected function addVariables($variables, $payload, Update $updateHelper)
    {
        $variables = array_merge($variables, $updateHelper->getVariables());
        if($payload['slug'] === 'vcv-about') {
            $variables[] = [
                'key' => 'VCV_ACTIVE_PAGE',
                'value' => 'last',
                'type' => 'constant',
            ];
        }

        return $variables;
    }
}
