<?php

namespace VisualComposer\Modules\Elements;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Class Controller
 * @package VisualComposer\Modules\Elements
 */
class Controller extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    /**
     * Controller constructor.
     */
    public function __construct()
    {
        if (vcvenv('VCV_FT_DEFAULT_ELEMENTS_INSIDE_PLUGIN')) {
            /** @see \VisualComposer\Modules\Elements\Controller::addDefaultElements */
            $this->wpAddAction('vcv:api', 'addDefaultElements');
        }
    }

    /**
     * Add built-in elements into system
     *
     * @param $api
     */
    protected function addDefaultElements($api)
    {
        $elementsToRegister = vchelper('DefaultElements')->all();
        $urlHelper = vchelper('Url');
        /** @var \VisualComposer\Modules\Elements\ApiController $elementsApi */
        $elementsApi = $api->elements;
        foreach ($elementsToRegister as $tag) {
            $manifestPath = VCV_PLUGIN_DIR_PATH . 'elements/' . $tag . '/manifest.json';
            $elementBaseUrl = $urlHelper->to('elements/' . $tag);
            $elementsApi->add($manifestPath, $elementBaseUrl);
        }
    }
}
