<?php

namespace VisualComposer\Modules\Editors\Settings;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Modules\Settings\Traits\Fields;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

/**
 * Class AlternativeSavingController
 * @package VisualComposer\Modules\Editors\Settings
 */
class AlternativeSavingController extends Container implements Module
{
    use Fields;
    use WpFiltersActions;
    use EventsFilters;

    protected $slug = 'vcv-settings';

    public function __construct()
    {
        $this->optionGroup = $this->slug;
        $this->optionSlug = 'vcv-settings-alternative-saving-enabled';
        $this->optionVcvSlug = 'settings-alternative-saving-enabled';
        $this->addFilter('vcv:dataAjax:getData', 'outputItem');
        $this->addEvent('vcv:system:factory:reset', 'unsetOptions');

        $this->wpAddAction(
            'admin_init',
            'buildPage',
            60
        );
    }

    protected function buildPage()
    {
        $sectionCallback = function () {
            echo sprintf(
                '<p class="description">%s</p>',
                esc_html__(
                    'Enable alternative saving method (Base64 encoded) if you experience problems when saving  content.',
                    'visualcomposer'
                )
            );
        };
        $this->addSection(
            [
                'title' => __('Alternative Save', 'visualcomposer'),
                'page' => $this->slug,
                'callback' => $sectionCallback,
            ]
        );

        $fieldCallback = function () {
            $outputHelper = vchelper('Output');
            /** @see \VisualComposer\Modules\Editors\Settings\ItemPreviewController::renderToggle */
            $outputHelper->printNotEscaped($this->call('renderToggle', ['value' => 'itemAlternativeSavingDisabled']));
        };

        $this->addField(
            [
                'page' => $this->slug,
                'title' => __('Alternative Save', 'visualcomposer'),
                'name' => $this->optionVcvSlug,
                'id' => $this->optionSlug,
                'fieldCallback' => $fieldCallback,
            ]
        );
    }

    /**
     * @param $value
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return mixed|string
     */
    protected function renderToggle($value, Options $optionsHelper)
    {
        $isEnabled = (bool)$optionsHelper->get($this->optionVcvSlug, false);

        return vcview(
            'settings/fields/toggle',
            [
                'name' => $this->optionSlug,
                'value' => $value,
                'isEnabled' => $isEnabled,
            ]
        );
    }

    protected function outputItem($response, $payload, Options $optionsHelper)
    {
        $isEnabled = $optionsHelper->get($this->optionVcvSlug, false);
        $response['itemAlternativeSavingDisabled'] = !$isEnabled;

        return $response;
    }

    protected function unsetOptions(Options $optionsHelper)
    {
        $optionsHelper->delete($this->optionVcvSlug);
    }
}
