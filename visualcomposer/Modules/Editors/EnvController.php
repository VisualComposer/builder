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

/**
 * Class EnvController
 * @package VisualComposer\Modules\Editors
 */
class EnvController extends Container implements Module
{
    use EventsFilters;

    /**
     * EnvController constructor.
     */
    public function __construct()
    {
        $this->addFilter('vcv:editor:variables vcv:wp:dashboard:variables', 'addEnvVariables');
    }

    /**
     * @param $variables
     *
     * @return array
     */
    protected function addEnvVariables($variables)
    {
        $variables[] = [
            'type' => 'constant',
            'key' => 'VCV_ENV',
            'value' => \VcvEnv::all(),
        ];
        $variables[] = [
            'type' => 'constant',
            'key' => 'VCV_PLUGIN_URL',
            'value' => VCV_PLUGIN_URL,
        ];
        $variables[] = [
            'type' => 'constant',
            'key' => 'VCV_SITE_URL',
            'value' => get_site_url(),
        ];
        $variables[] = [
            'type' => 'constant',
            'key' => 'VCV_ADMIN_URL',
            'value' => get_admin_url(),
        ];

        return $variables;
    }
}
