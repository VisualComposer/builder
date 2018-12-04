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

class JsEditor extends Container implements Module
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
        $this->optionSlug = 'vcv-global-js';
        $this->wpAddAction(
            'admin_enqueue_scripts',
            'beforeRender'
        );
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
                esc_html__(
                    'Add custom Javascript code to insert it globally on every page in <header> and <footer>. Insert Google Analytics, Tag Manager, Kissmetrics or other Javascript code snippets.',
                    'vcwb'
                )
            );
        };

        $this->addSection(
            [
                'title' => __('Custom Javascript', 'vcwb'),
                'slug' => 'settingsGlobalJs',
                'page' => $this->slug,
                'callback' => $sectionCallback,
            ]
        );

        $globalJsSettings = [
            [
                'slug' => 'settingsGlobalJsHead',
                'value' => $optionsHelper->get('settingsGlobalJsHead', false),
            ],
            [
                'slug' => 'settingsGlobalJs',
                'value' => $optionsHelper->get('settingsGlobalJs', false),
            ],
        ];

        foreach ($globalJsSettings as $globalSetting) {
            $fieldCallback = function ($data) use ($globalSetting) {
                echo $this->call('renderEditor', ['data' => $data, 'globalSetting' => $globalSetting]);
            };

            $this->addField(
                [
                    'page' => $this->slug,
                    'slug' => $globalSetting['slug'],
                    'id' => $globalSetting['slug'],
                    'fieldCallback' => $fieldCallback,
                    'args' => [
                        'class' => 'vcv-css-js-editor vcv-js-editor-' . $globalSetting['slug']
                    ]
                ]
            );
        }
    }

    protected function renderEditor($data, $globalSetting)
    {
        return vcview(
            'settings/pages/js-editor/js-editor',
            [
                'globalSetting' => $globalSetting,
            ]
        );
    }

    protected function beforeRender()
    {
        if (function_exists('wp_enqueue_code_editor')) {
            wp_enqueue_code_editor(['type' => 'text/javascript']);
        }
    }

    protected function unsetOptions(Options $optionsHelper)
    {
        $optionsHelper->delete('vcv-global-js');
    }
}
