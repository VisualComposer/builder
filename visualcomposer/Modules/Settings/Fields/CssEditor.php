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

        /** @see \VisualComposer\Modules\Settings\Fields\CssEditor::buildPage */
        $this->wpAddAction(
            'admin_init',
            'buildPage'
        );
        $this->addEvent(
            'vcv:settings:page:vcv-global-css-js:beforeRender',
            'enqueueAssets'
        );
    }

    /**
     * @param \VisualComposer\Helpers\Options $optionsHelper
     */
    protected function buildPage(Options $optionsHelper)
    {
        $sectionCallback = function () {
            echo sprintf(
                '<p class="description">%s</p>',
                esc_html__('Global CSS will be applied sitewide.', 'visualcomposer')
            );
        };

        $fieldSlug = 'settingsGlobalCss';
        $globalSetting = [
            'label' => __('Custom CSS', 'visualcomposer'),
            'slug' => $fieldSlug,
            'value' => $optionsHelper->get($fieldSlug),
        ];

        $this->addSection(
            [
                'title' => $globalSetting['label'],
                'slug' => $fieldSlug,
                'page' => $this->slug,
                'callback' => $sectionCallback,
            ]
        );

        $fieldCallback = function ($data) use ($globalSetting) {
            $outputHelper = vchelper('Output');
            $outputHelper->printNotEscaped($this->call('renderEditor', ['data' => $data, 'globalSetting' => $globalSetting]));
        };

        $this->addField(
            [
                'page' => $this->slug,
                'slug' => $fieldSlug,
                'name' => $fieldSlug,
                'id' => $fieldSlug,
                'fieldCallback' => $fieldCallback,
                'args' => [
                    'class' => 'vcv-css-js-editor vcv-js-editor-' . $fieldSlug,
                ],
            ]
        );
    }

    protected function renderEditor($data, $globalSetting)
    {
        return vcview(
            'settings/fields/css-editor/css-editor',
            [
                'globalSetting' => $globalSetting,
            ]
        );
    }

    protected function enqueueAssets()
    {
        if (function_exists('wp_enqueue_code_editor')) {
            wp_enqueue_code_editor(['type' => 'text/css']);
        }
    }
}
