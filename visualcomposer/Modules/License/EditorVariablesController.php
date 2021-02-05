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
        $isPremiumActivated = $licenseHelper->isPremiumActivated();
        $variables[] = [
            'key' => 'vcvIsPremiumActivated',
            'value' => $isPremiumActivated,
            'type' => 'variable',
        ];

        if (!$isPremiumActivated) {
            $variables[] = [
                'key' => 'vcvAgreeHubTerms',
                'value' => $licenseHelper->agreeHubTerms(),
                'type' => 'variable',
            ];
        }

        return $variables;
    }
}
