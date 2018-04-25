<?php

namespace VisualComposer\Modules\Hub;

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
        $this->addFilter('vcv:frontend:head:extraOutput', 'outputAddons');
    }

    /**
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\Hub\Addons $hubHelper
     *
     * @return array
     */
    protected function outputAddons($response, $payload, HubAddons $hubHelper)
    {
        return array_merge(
            $response,
            [
                vcview(
                    'partials/constant-script',
                    [
                        'key' => 'VCV_HUB_GET_ADDONS',
                        'value' => $hubHelper->getAddons(),
                    ]
                ),
            ]
        );
    }
}
