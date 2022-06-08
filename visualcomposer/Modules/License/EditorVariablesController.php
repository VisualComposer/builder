<?php

namespace VisualComposer\Modules\License;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;

class EditorVariablesController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        $this->addFilter('vcv:editor:variables vcv:wp:dashboard:variables', 'addVariables');
    }

    protected function addVariables($variables, $payload)
    {
        $licenseHelper = vchelper('License');
        $active = vcfilter(
            'vcv:modules:license:editorVariablesController:addVariables',
            $licenseHelper->isPremiumActivated()
        );
        $variables[] = [
            'key' => 'vcvIsPremiumActivated',
            'value' => $active,
            'type' => 'variable',
        ];

        if (!$active) {
            $variables[] = [
                'key' => 'vcvAgreeHubTerms',
                'value' => $licenseHelper->agreeHubTerms(),
                'type' => 'variable',
            ];
        }

        return $variables;
    }
}
