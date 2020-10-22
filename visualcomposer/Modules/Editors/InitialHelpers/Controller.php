<?php

namespace VisualComposer\Modules\Editors\InitialHelpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;

class Controller extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        $this->addFilter('vcv:editor:variables', 'addInitialHelperVariables');
        $this->addFilter('vcv:ajax:editors:initialHelpers:disable:adminNonce', 'disableInitialHelpers');
    }

    /**
     * @param $variables
     * @param $payload
     *
     * @return array
     */
    protected function addInitialHelperVariables($variables, $payload)
    {
        if (isset($payload['sourceId'])) {
            $optionsHelper = vchelper('Options');
            $isEnabled = $optionsHelper->get('settings-initial-helpers-enabled', true);

            $variables[] = [
                'key' => 'VCV_SHOW_INITIAL_HELPERS',
                'value' => $isEnabled,
                'type' => 'constant',
            ];
        }

        return $variables;
    }

    /**
     * Disable initial helpers after user sees those
     *
     * @param $response
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return array
     */
    protected function disableInitialHelpers(Options $optionsHelper)
    {
        $optionsHelper->set('settings-initial-helpers-enabled', '');

        return ['status' => true];
    }
}
