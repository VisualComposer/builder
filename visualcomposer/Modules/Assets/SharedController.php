<?php

namespace VisualComposer\Modules\Assets;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\AssetsShared;
use VisualComposer\Helpers\Traits\EventsFilters;

class SharedController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        $this->addFilter('vcv:editor:variables', 'addVariables');
    }

    protected function addVariables($variables, $payload, AssetsShared $assetsSharedHelper)
    {
        $variables[] = [
            'key' => 'VCV_GET_SHARED_ASSETS',
            'value' => $assetsSharedHelper->getSharedAssets(),
            'type' => 'constant',
        ];

        return $variables;
    }
}
