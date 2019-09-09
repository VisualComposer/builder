<?php

namespace VisualComposer\Modules\Hub;

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

class UpdateController extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    public function __construct()
    {
        // Factory reset
        $this->addEvent('vcv:system:activation:hook vcv:system:factory:reset', 'unsetOptions', -1);
    }

    protected function unsetOptions(Options $optionsHelper)
    {
        $optionsHelper
            ->delete('bundleUpdateRequired')
            ->delete('bundleUpdateActions')
            ->delete('bundleUpdateJson')
            ->deleteTransient('bundleUpdateJson')
            ->deleteTransient('lastBundleUpdate');
    }
}
