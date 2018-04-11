<?php

namespace VisualComposer\Modules\Hub\AddonTeasers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;

class AddonTeasersController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        if (vcvenv('VCV_ENV_HUB_ADDON_TEASER')) {
            $this->addFilter('vcv:editor:variables', 'outputTeaserAddons');
        }
    }

    protected function outputTeaserAddons($variables, Options $optionsHelper)
    {
        $value = array_values(
            (array)$optionsHelper->get(
                'hubTeaserAddons',
                []
            )
        );
        $key = 'VCV_HUB_GET_ADDON_TEASER';

        $variables[] = [
            'key' => $key,
            'value' => $value,
            'type' => 'constant',
        ];

        return $variables;
    }
}
