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
                    'Display the editor window above the content ',
                    'visualcomposer'
                )
            );
        };
        $this->addSection(
            [
                'title' => __('Editor Window Position', 'visualcomposer'),
                'page' => $this->slug,
                'callback' => $sectionCallback,
            ]
        );

        $fieldCallback = function () {
            /** @see \VisualComposer\Modules\Editors\Settings\EditorLayoutController::renderToggle */
            echo $this->call('renderToggle', ['value' => 'dynamic']);
        };

        $this->addField(
            [
                'page' => $this->slug,
                'title' => __('Above Content', 'visualcomposer'),
                'name' => 'settings-editor-layout-desktop',
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
        $isEnabled = (bool)$optionsHelper->get('settings-editor-layout-desktop', true);

        return vcview(
            'settings/fields/toggle',
            [
                'name' => $this->optionSlug,
                'value' => $value,
                'isEnabled' => $isEnabled,
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
