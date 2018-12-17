<?php

namespace VisualComposer\Modules\Elements;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class Controller extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    public function __construct()
    {
        $this->addEvent('vcv:system:factory:reset', 'unsetOptions');
        if (vcvenv('VCV_FT_DEFAULT_ELEMENTS_INSIDE_PLUGIN')) {
            $this->wpAddAction('vcv:api', 'addDefaultElements');
        }
    }

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

    protected function unsetOptions(Options $optionsHelper)
    {
        $optionsHelper
            ->delete('hubElements')
            ->delete('hubCategories')
            ->delete('hubGroups');
    }
}
