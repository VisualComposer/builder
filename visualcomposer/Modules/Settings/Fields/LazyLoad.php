<?php

namespace VisualComposer\Modules\Settings\Fields;

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
 * Class LazyLoad
 * @package VisualComposer\Modules\Settings\Fields
 */
class LazyLoad extends Container implements Module
{
    use Fields;
    use WpFiltersActions;
    use EventsFilters;

    protected $slug = 'vcv-settings';

    public function __construct()
    {
        $this->optionGroup = $this->slug;
        $this->optionSlug = 'vcv-settings-lazy-load-enabled';
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
                    'Disable the lazy load option to prevent content lazy load and/or troubleshoot problems with previously added images.',
                    'visualcomposer'
                )
            );
        };
        $this->addSection(
            [
                'title' => __('Lazy Load', 'visualcomposer'),
                'page' => $this->slug,
                'callback' => $sectionCallback,
            ]
        );

        $fieldCallback = function () {
            /** @see \VisualComposer\Modules\Editors\Settings\ItemPreviewController::renderToggle */
            echo $this->call('renderToggle', ['value' => true]);
        };

        $this->addField(
            [
                'page' => $this->slug,
                'title' => __('Lazy Load', 'visualcomposer'),
                'name' => 'settings-lazy-load-enabled',
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
        $isEnabled = (bool)$optionsHelper->get('settings-lazy-load-enabled', true);

        return vcview(
            'settings/fields/toggle',
            [
                'name' => $this->optionSlug,
                'value' => $value,
                'isEnabled' => $isEnabled,
            ]
        );
    }

    protected function unsetOptions(Options $optionsHelper)
    {
        $optionsHelper->delete('settings-lazy-load-enabled');
    }
}
