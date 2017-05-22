<?php

namespace VisualComposer\Modules\Hub;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Assets;
use VisualComposer\Helpers\Hub;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Url;

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
     * @param \VisualComposer\Helpers\Hub $hubHelper
     *
     * @return array
     */
    protected function outputCategories($response, $payload, Hub $hubHelper)
    {
        return array_merge(
            $response,
            [
                vcview(
                    'hub/categories',
                    [
                        'categories' => $hubHelper->getCategories(),
                    ]
                ),
            ]
        );
    }
}
