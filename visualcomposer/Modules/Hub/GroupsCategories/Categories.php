<?php

namespace VisualComposer\Modules\Hub\GroupsCategories;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Hub\Categories as HubCategories;

/**
 * Class Categories
 * @package VisualComposer\Modules\Hub\GroupsCategories
 */
class Categories extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    /**
     * Categories constructor.
     */
    public function __construct()
    {
        $this->addFilter('vcv:frontend:body:extraOutput', 'outputCategories');
    }

    /**
     * @param $response
     * @param $payload
     * @param HubCategories $hubHelper
     *
     * @return array
     */
    protected function outputCategories($response, $payload, HubCategories $hubHelper)
    {
        return array_merge(
            $response,
            [
                vcview(
                    'partials/constant-script',
                    [
                        'key' => 'VCV_HUB_GET_CATEGORIES',
                        'value' => $hubHelper->getCategories(),
                    ]
                ),
            ]
        );
    }
}
