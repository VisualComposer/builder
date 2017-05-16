<?php

namespace VisualComposer\Modules\Hub;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Hub;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Url;

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
     * @param \VisualComposer\Helpers\Hub $hubHelper
     *
     * @return array
     */
    protected function outputElements($response, $payload, Hub $hubHelper)
    {
        return array_merge(
            $response,
            [
                vcview(
                    'hub/elements',
                    [
                        'elements' => $hubHelper->getElements(),
                    ]
                ),
            ]
        );
    }

    /**
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\Hub $hubHelper
     *
     * @return array
     */
    protected function outputElementsBundle($response, $payload, Hub $hubHelper)
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
