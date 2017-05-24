<?php

namespace VisualComposer\Modules\Hub;

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
 * @package VisualComposer\Modules\Hub
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
        /** @see \VisualComposer\Modules\Hub\Categories::outputCategories */
        $this->addFilter('vcv:frontend:body:extraOutput vcv:backend:extraOutput', 'outputCategories');
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
