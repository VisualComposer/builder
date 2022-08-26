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
 * Class ItemInitialHelpersController
 * @package VisualComposer\Modules\Editors\Settings
 */
class ItemInitialHelpersController extends Container implements Module
{
    use Fields;
    use WpFiltersActions;
    use EventsFilters;

    protected $slug = 'vcv-settings';

    public function __construct()
    {
        $this->optionGroup = $this->slug;
        $this->optionSlug = 'vcv-settings-initial-helpers-enabled';

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
                    'Display an interactive help guide when you enter the editor next time.',
                    'visualcomposer'
                )
            );
        };
        $this->addSection(
            [
                'title' => __('Help Guide', 'visualcomposer'),
                'page' => $this->slug,
                'callback' => $sectionCallback,
            ]
        );

        $fieldCallback = function () {
            /** @see \VisualComposer\Modules\Editors\Settings\itemInitialHelpersEnabled::renderToggle */
            $outputHelper = vchelper('Output');
            $outputHelper->printNotEscaped($this->call('renderToggle', ['value' => 'itemInitialHelpersEnabled']));
        };

        $this->addField(
            [
                'page' => $this->slug,
                'title' => __('Display Help Guide', 'visualcomposer'),
                'name' => 'settings-initial-helpers-enabled',
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
        $isEnabled = (bool)$optionsHelper->get('settings-initial-helpers-enabled', false);

        return vcview(
            'settings/fields/yesnotoggle',
            [
                'name' => $this->optionSlug,
                'value' => $value,
                'isEnabled' => $isEnabled,
            ]
        );
    }
}
