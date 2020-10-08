<?php

namespace VisualComposer\Modules\Hub\Addons\Teasers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Data;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;

/**
 * Class TeasersController
 * @package VisualComposer\Modules\Hub\Addons\Teasers
 */
class TeasersController extends Container implements Module
{
    use EventsFilters;

    /**
     * TeasersController constructor.
     */
    public function __construct()
    {
        $this->addEvent('vcv:hub:teasers:updateStatus', 'setAddonTeaserStatus');

        $this->addFilter('vcv:editor:variables', 'addTeaserAddonsVariables');
        $this->addFilter('vcv:hub:variables', 'addTeaserAddonsVariables');
    }

    /**
     * @param \VisualComposer\Helpers\Options $optionsHelper
     * @param \VisualComposer\Helpers\Data $dataHelper
     */
    protected function setAddonTeaserStatus(
        Options $optionsHelper,
        Data $dataHelper
    ) {
        $teaserAddons = $optionsHelper->get('hubTeaserAddons', false);
        if (!empty($teaserAddons)) {
            while ($newAddonKey = $dataHelper->arraySearch($teaserAddons, 'isNew', true, true)) {
                $teaserAddons[ $newAddonKey ]['isNew'] = time();
            }
            $optionsHelper->set('hubTeaserAddons', $teaserAddons);
        }
    }

    /**
     * @param $variables
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return array
     */
    protected function addTeaserAddonsVariables($variables, Options $optionsHelper)
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
            'value' => vcfilter('vcv:account:addon:teasers', $value),
            'type' => 'constant',
        ];

        return $variables;
    }
}
