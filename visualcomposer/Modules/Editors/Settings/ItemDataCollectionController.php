<?php

namespace VisualComposer\Modules\Editors\Settings;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Modules\Settings\Traits\Fields;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

/**
 * Class ItemDataCollectionControllerController
 * @package VisualComposer\Modules\Editors\Settings
 */
class ItemDataCollectionController extends Container implements Module
{
    use Fields;
    use WpFiltersActions;
    use EventsFilters;

    protected $slug = 'vcv-settings';

    public function __construct()
    {
        $this->optionGroup = $this->slug;
        $this->optionSlug = 'vcv-settings-itemdatacollection-enabled';

        $this->wpAddAction(
            'admin_init',
            'buildPage',
            50
        );
        $this->addFilter('vcv:editor:variables', 'addVariables');
    }

    protected function buildPage()
    {
        $sectionCallback = function () {
            echo sprintf(
                '<p class="description">%s</p>',
                esc_html__(
                    'Help to make Visual Composer better by sharing anonymous usage data. We appreciate your help.',
                    'visualcomposer'
                )
            );
        };
        $this->addSection(
            [
                'title' => __('Share Usage Data', 'visualcomposer'),
                'page' => $this->slug,
                'callback' => $sectionCallback,
            ]
        );
        $outputHelper = vchelper('Output');

        $fieldCallback = function () use ($outputHelper) {
            /** @see \VisualComposer\Modules\Editors\Settings\itemDataCollectionEnabled::renderToggle */
            $outputHelper->printNotEscaped($this->call('renderToggle', ['value' => 'itemDataCollectionEnabled']));
        };
        $innerTableCallback = function () use ($outputHelper) {
            $outputHelper->printNotEscaped($this->call('renderTable', ['value' => 'itemDataCollectionTable']));
        };

        $this->addField(
            [
                'page' => $this->slug,
                'title' => __('Share anonymous data', 'visualcomposer'),
                'name' => 'settings-itemdatacollection-enabled',
                'id' => $this->optionSlug,
                'fieldCallback' => $fieldCallback,
                'args' => [
                    'class' => 'vcv-settings-itemdatacollection-table',
                ],
            ]
        );

        $this->addSection(
            [
                'page' => $this->slug,
                'slug' => 'settings-itemdatacollection-table',
                'vcv-args' => [
                    'class' => 'vcv-settings-itemdatacollection-child',
                    'parent' => 'vcv-settings-itemdatacollection-enabled',
                ],
            ]
        );

        $this->addField(
            [
                'page' => $this->slug,
                'name' => 'settings-itemdatacollection-table',
                'id' => 'vcv-settings-itemdatacollection-table',
                'slug' => 'settings-itemdatacollection-table',
                'fieldCallback' => $innerTableCallback,
                'args' => [
                    'vcv-no-label' => true,
                ],
            ]
        );
    }

    protected function addVariables($variables, $payload)
    {
        $variables[] = [
            'key' => 'vcvSettingsDashboardUrl',
            'value' => set_url_scheme(admin_url('admin.php?page=vcv-settings')),
            'type' => 'variable',
        ];

        return $variables;
    }

    /**
     * @param $value
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return mixed|string
     */
    protected function renderToggle($value, Options $optionsHelper)
    {
        $isEnabled = (bool)$optionsHelper->get('settings-itemdatacollection-enabled', false);

        return vcview(
            'settings/fields/toggle',
            [
                'name' => $this->optionSlug,
                'value' => $value,
                'isEnabled' => $isEnabled,
            ]
        );
    }

    /**
     * @param $value
     *
     * @return mixed|string
     */
    protected function renderTable($value)
    {
        return vcview(
            'settings/fields/dataCollectionTable',
            [
                'name' => $this->optionSlug,
                'value' => $value,
            ]
        );
    }
}
