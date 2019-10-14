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
 * Class ItemPreviewController
 * @package VisualComposer\Modules\Editors\Settings
 */
class ItemPreviewController extends Container implements Module
{
    use Fields;
    use WpFiltersActions;
    use EventsFilters;

    protected $slug = 'vcv-settings';

    public function __construct()
    {
        $this->optionGroup = $this->slug;
        $this->optionSlug = 'vcv-frontendSettings';
        $this->addFilter('vcv:dataAjax:getData', 'outputItemPreview');
        $this->addEvent('vcv:system:factory:reset', 'unsetOptions');

        $this->wpAddAction(
            'admin_init',
            'buildPage',
            11
        );
    }

    protected function buildPage()
    {
        $sectionCallback = function () {
            echo sprintf(
                '<p class="description">%s</p>',
                esc_html__(
                    'Disable element and template preview popup in Add Element and Add Template windows.',
                    'vcwb'
                )
            );
        };
        $this->addSection(
            [
                'title' => __('Disable preview', 'visualcomposer'),
                'page' => $this->slug,
                'callback' => $sectionCallback,
            ]
        );

        $fieldCallback = function () {
            echo $this->call('renderToggle', ['value' => 'itemPreviewDisabled']);
        };

        $this->addField(
            [
                'page' => $this->slug,
                'title' => __('Disable Preview', 'visualcomposer'),
                'name' => 'frontendSettings',
                'id' => 'vcv-frontendSettings-itemPreviewDisabled',
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
        $settings = (array)$optionsHelper->get('frontendSettings', []);
        if (array_key_exists('itemPreviewDisabled', $settings) && $settings['itemPreviewDisabled']) {
            $settings[] = 'itemPreviewDisabled';
        }

        return vcview(
            'settings/option-toggle',
            [
                'key' => $this->optionSlug,
                'value' => $value,
                'enabledOptions' => $settings,
            ]
        );
    }

    protected function outputItemPreview($response, $payload, Options $optionsHelper)
    {
        $frontendSettings = (array)$optionsHelper->get('frontendSettings', []);

        $response['itemPreviewDisabled'] = false;
        if ((array_key_exists('itemPreviewDisabled', $frontendSettings) && $frontendSettings['itemPreviewDisabled'])
            || in_array('itemPreviewDisabled', $frontendSettings, true)) {
            $response['itemPreviewDisabled'] = true;
        }

        return $response;
    }

    protected function unsetOptions(Options $optionsHelper)
    {
        $optionsHelper->delete('frontendSettings');
    }
}
