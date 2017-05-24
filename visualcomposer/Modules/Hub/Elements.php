<?php

namespace VisualComposer\Modules\Hub;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Hub\Elements as HubElements;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Class Elements
 * @package VisualComposer\Modules\Hub
 */
class Elements extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    /**
     * @var
     */
    protected $elements;

    /**
     * Elements constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\Hub\Elements::outputElements */
        $this->addFilter('vcv:frontend:head:extraOutput vcv:backend:extraOutput', 'outputElements');
        $this->addFilter('vcv:frontend:footer:extraOutput vcv:backend:extraOutput', 'outputElementsBundle', 3);
    }

    /**
     * @param $response
     * @param $payload
     * @param HubElements $hubHelper
     *
     * @return array
     */
    protected function outputElements($response, $payload, HubElements $hubHelper)
    {
        return array_merge(
            $response,
            [
                vcview(
                    'partials/constant-script',
                    [
                        'key' => 'VCV_HUB_GET_ELEMENTS',
                        'value' => $hubHelper->getElements(),
                    ]
                ),
            ]
        );
    }

    /**
     * @param $response
     * @param $payload
     * @param HubElements $hubHelper
     *
     * @return array
     */
    protected function outputElementsBundle($response, $payload, HubElements $hubHelper)
    {
        return array_merge(
            $response,
            [
                vcview(
                    'hub/elementsBundle',
                    [
                        'elements' => $hubHelper->getElements(),
                    ]
                ),
            ]
        );
    }
}
