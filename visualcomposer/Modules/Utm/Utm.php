<?php

namespace VisualComposer\Modules\Utm;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Utm as UtmHelper;
use VisualComposer\Helpers\Traits\EventsFilters;

/**
 * Class Utm
 * @package VisualComposer\Modules\Utm
 */
class Utm extends Container implements Module
{
    use EventsFilters;

    /**
     * Utm constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\Utm\Utm::addUtmVariable */
        $this->addFilter(
            'vcv:editor:variables vcv:hub:variables vcv:wp:dashboard:variables',
            'addUtmVariable'
        );
        $this->addFilter(
            'vcv:hub:variables',
            'addUtmVariable'
        );
    }

    /**
     * @param $variables
     * @param $payload
     * @param \VisualComposer\Helpers\Utm $utmHelper
     *
     * @return array
     */
    protected function addUtmVariable($variables, $payload, UtmHelper $utmHelper)
    {
        $variables[] = [
            'key' => 'VCV_UTM',
            'value' => $utmHelper->all(),
            'type' => 'constant',
        ];

        return $variables;
    }
}
