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
 * Class EditorLayoutController
 * @package VisualComposer\Modules\Editors\Settings
 */
class EditorLayoutController extends Container implements Module
{
    use Fields;
    use WpFiltersActions;
    use EventsFilters;

    protected $slug = 'vcv-settings';

    public function __construct()
    {
        $this->optionGroup = $this->slug;
        $this->optionSlug = 'vcv-settings-editor-layout-desktop';
        $this->addFilter('vcv:dataAjax:getData', 'outputEditorLayoutDesktop');
        $this->addEvent('vcv:system:factory:reset', 'unsetOptions');

        $this->wpAddAction(
            'admin_init',
            'buildPage',
            50
        );
    }

    protected function buildPage()
    {
        $sectionCallback = function () {
            echo sprintf(
                '<p class="description">%s</p>',
                esc_html__(
                    'Specify the default state for the "Responsive View" control.',
                    'visualcomposer'
                )
            );
        };
        $this->addSection(
            [
                'title' => __('Default Responsive View', 'visualcomposer'),
                'page' => $this->slug,
                'callback' => $sectionCallback,
            ]
        );

        $dropdownFieldCallback = function () {
            echo $this->call('renderAboveContentDropdown');
        };

        $this->addField(
            [
                'page' => $this->slug,
                'name' => 'settings-editor-layout-desktop',
                'id' => $this->optionSlug,
                'fieldCallback' => $dropdownFieldCallback,
                'args' => [
                    'class' => 'vcv-no-title',
                ],
            ]
        );
    }

    protected function renderAboveContentDropdown(Options $optionsHelper)
    {
        $selectedAboveContentValue = $optionsHelper->get('settings-editor-layout-desktop');

        return vcview(
            'settings/fields/dropdown',
            [
                'name' => 'vcv-settings-editor-layout-desktop',
                'value' => $selectedAboveContentValue,
                'enabledOptions' => [
                    ['id' => 'desktop', 'title' => 'Desktop'],
                    ['id' => 'dynamic', 'title' => 'Dynamic View'],
                ],
            ]
        );
    }

    protected function outputEditorLayoutDesktop($response, $payload, Options $optionsHelper)
    {
        $isEnabled = $optionsHelper->get('settings-editor-layout-desktop', true);
        $response['outputEditorLayoutDesktop'] = $isEnabled;

        return $response;
    }

    protected function unsetOptions(Options $optionsHelper)
    {
        $optionsHelper->delete('settings-editor-layout-desktop');
    }
}
