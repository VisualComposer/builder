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
use VisualComposer\Helpers\Request;
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
     *
     * @param \VisualComposer\Helpers\Request $requestHelper
     */
    public function __construct(Request $requestHelper)
    {
        $this->optionGroup = $this->slug;
        $this->optionSlug = 'vcv-global-css';

        if (($requestHelper->input('page') === $this->slug)) {
            $this->wpAddAction(
                'admin_enqueue_scripts',
                'beforeRender'
            );
        }

        $this->wpAddAction(
            'admin_init',
            'buildPage'
        );
        $this->addEvent('vcv:system:factory:reset', 'unsetOptions');
    }

    /**
     * @param \VisualComposer\Helpers\Options $optionsHelper
     */
    protected function buildPage(Options $optionsHelper)
    {
        $sectionCallback = function () {
            echo sprintf(
                '<p class="description">%s</p>',
                esc_html__('Add custom CSS code to insert it globally on every page.', 'vcwb')
            );
        };

        $fieldSlug = 'settingsGlobalCss';
        $globalSetting = [
            'label' => __('Custom CSS', 'vcwb'),
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
            echo $this->call('renderEditor', ['data' => $data, 'globalSetting' => $globalSetting]);
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
            'settings/pages/css-editor/css-editor',
            [
                'globalSetting' => $globalSetting,
            ]
        );
    }

    protected function beforeRender()
    {
        if (function_exists('wp_enqueue_code_editor')) {
            wp_enqueue_code_editor(['type' => 'text/css']);
        }
    }

    protected function unsetOptions(Options $optionsHelper)
    {
        $optionsHelper->delete('vcv-global-css');
    }
}
