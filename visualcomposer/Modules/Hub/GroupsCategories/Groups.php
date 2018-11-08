<?php

namespace VisualComposer\Modules\Hub\GroupsCategories;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Hub\Groups as HubGroups;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Class Groups
 * @package VisualComposer\Modules\Hub
 */
class Groups extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    /**
     * Groups constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\Hub\Groups::outputGroups */
        $this->addFilter('vcv:frontend:body:extraOutput', 'outputGroups');
    }

    /**
     * @param $response
     * @param $payload
     * @param HubGroups $hubHelper
     *
     * @return array
     */
    protected function outputGroups($response, $payload, HubGroups $hubHelper)
    {
        return array_merge(
            $response,
            [
                vcview(
                    'partials/constant-script',
                    [
                        'key' => 'VCV_HUB_GET_GROUPS',
                        'value' => array_values($hubHelper->getGroups()),
                    ]
                ),
            ]
        );
    }
}
