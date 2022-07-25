<?php

namespace VisualComposer\Modules\Hub\Addons;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Hub\Addons as HubAddons;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Class Elements
 * @package VisualComposer\Modules\Hub
 */
class Addons extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    /**
     * Elements constructor.
     */
    public function __construct()
    {
        $this->addFilter('vcv:editor:variables', 'addAddonsVariables');
        $this->addFilter('vcv:hub:variables', 'addAddonsVariables');
    }

    /**
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\Hub\Addons $hubHelper
     *
     * @return array
     */
    protected function addAddonsVariables($variables, $payload, HubAddons $hubHelper)
    {
        $key = 'VCV_HUB_GET_ADDONS';

        $variables[] = [
            'key' => $key,
            'value' => $hubHelper->getAddons(false),
            'type' => 'constant',
            'options' => JSON_FORCE_OBJECT | JSON_NUMERIC_CHECK,
        ];

        $key = 'VCV_HUB_GET_MIGRATED_TO_FREE_ADDONS';

        $variables[] = [
            'key' => $key,
            'value' => $hubHelper->getMigratedToFree(),
            'type' => 'constant',
            'options' => JSON_FORCE_OBJECT | JSON_NUMERIC_CHECK,
        ];

        return $variables;
    }
}
