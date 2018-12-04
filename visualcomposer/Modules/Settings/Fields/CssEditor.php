<?php

namespace VisualComposer\Modules\Settings\Fields;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Modules\Settings\Traits\Fields;

class CssEditor extends Container implements Module
{
    use Fields;
    use WpFiltersActions;
    use EventsFilters;

    protected $slug = 'vcv-global-css-js';

    /**
     * GlobalCssJs constructor.
     */
    public function __construct()
    {
        $this->optionGroup = $this->slug;
        $this->optionSlug = 'vcv-global-css';
        /** @see \VisualComposer\Modules\Settings\Fields\PostTypes::buildPage */
        $this->wpAddAction(
            'admin_init',
            'buildPage'
        );
        $this->addEvent('vcv:system:factory:reset', 'unsetOptions');
    }

    /**
     * Page: Post Types Settings.
     *
     * @param \VisualComposer\Helpers\PostType $postTypeHelper
     */
    protected function buildPage(Options $optionsHelper)
    {
        $sectionCallback = function () {
            echo sprintf(
                '<p class="description">%s</p>',
                esc_html__('Add custom CSS code to insert it globally on every page.', 'vcwb')
            );
        };

        $globalSetting = [
            'label' => __('Custom CSS', 'vcwb'),
            'slug' => 'settingsGlobalCss',
            'value' => $optionsHelper->get('settingsGlobalCss', true),
        ];

        $this->addSection(
            [
                'title' => $globalSetting['label'],
                'slug' => $globalSetting['slug'],
                'page' => $this->slug,
                'callback' => $sectionCallback,
            ]
        );

        $fieldCallback = function ($data) use ($globalSetting) {
            echo $this->call('renderEditor', ['data' => $data, 'globalSetting' => $globalSetting]);
        };

        $this->addField(
            [
                'page' => $this->slug,
                'slug' => $globalSetting['slug'],
                'id' => $globalSetting['slug'],
                'fieldCallback' => $fieldCallback,
            ]
        );
    }

    protected function renderEditor($data, $globalSetting)
    {
        return vcview(
            'settings/pages/css-editor/css-editor',
            [
                'globalSetting' => $globalSetting,
            ]
        );
    }

    protected function unsetOptions(Options $optionsHelper)
    {
        $optionsHelper->delete('vcv-global-css');
    }
}
