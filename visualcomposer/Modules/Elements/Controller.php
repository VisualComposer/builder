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

class Controller extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        $this->addEvent('vcv:system:factory:reset', 'unsetOptions');
    }

    protected function unsetOptions(Options $optionsHelper)
    {
        $optionsHelper
            ->delete('hubElements')
            ->delete('hubCategories')
            ->delete('hubGroups')
            ->delete('resetAppliedV' . vcvenv('VCV_ENV_ELEMENT_DOWNLOAD_V'));
    }
}
