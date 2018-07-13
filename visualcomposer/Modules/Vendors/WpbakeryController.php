<?php

namespace VisualComposer\Modules\Vendors;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class WpbakeryController extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    public function __construct()
    {
        $this->wpAddAction('plugins_loaded', 'initialize', 16);
    }

    protected function initialize()
    {
        if (defined('WPB_VC_VERSION')) {
            $this->addFilter('vcv:editor:variables', 'outputVcMap');
        }
    }

    protected function outputVcMap($variables)
    {
        $value =\WPBMap::getShortCodes();
        $key = 'VCV_API_WPBAKERY_VC_MAP';

        $variables[] = [
            'key' => $key,
            'value' => array_keys($value),
            'type' => 'constant',
        ];

        return $variables;
    }
}
