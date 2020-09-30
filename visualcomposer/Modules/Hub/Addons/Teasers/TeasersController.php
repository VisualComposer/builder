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
        $this->addFilter('vcv:ajax:hub:addons:teasers:updateStatus:adminNonce', 'ajaxSetAddonTeaserStatus');

        $this->addFilter('vcv:editor:variables', 'addTeaserAddonsVariables');
        $this->addFilter('vcv:hub:variables', 'addTeaserAddonsVariables');
    }

    /**
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\Options $optionsHelper
     * @param \VisualComposer\Helpers\Data $dataHelper
     *
     * @return bool
     */
    protected function ajaxSetAddonTeaserStatus(
        $response,
        $payload,
        Request $requestHelper,
        Options $optionsHelper,
        Data $dataHelper
    ) {
        $tag = $requestHelper->input('vcv-item-tag');
        $teaserAddons = $optionsHelper->get('hubTeaserAddons', false);
        $newAddonKey = $dataHelper->arraySearch(
            $teaserAddons,
            'bundle',
            $tag,
            true
        );
        if ($newAddonKey !== false) {
            $teaserAddons[ $newAddonKey ]['isNew'] = false;
            $optionsHelper->set('hubTeaserAddons', $teaserAddons);
        }

        return true;
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
