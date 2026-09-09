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
        $this->optionSlug = $this->slug;

        $this->wpAddAction(
            'admin_init',
            'buildPage'
        );
        $this->addEvent(
            'vcv:settings:page:vcv-global-css-js:beforeRender',
            'enqueueAssets'
        );

        // Strip scripts on save for users without the "unfiltered_html" capability.
        $this->wpAddFilter('sanitize_option_' . VCV_PREFIX . 'settingsGlobalJsHead', 'sanitizeGlobalJs');
        $this->wpAddFilter('sanitize_option_' . VCV_PREFIX . 'settingsGlobalJsFooter', 'sanitizeGlobalJs');
    }

    /**
     * @param \VisualComposer\Helpers\Options $optionsHelper
     */
    protected function buildPage(Options $optionsHelper)
    {
        if (!$this->hasUnfilteredHtmlAccess()) {
            return;
        }

        $sectionCallback = function () {
            echo sprintf(
                '<p class="description">%s</p>',
                esc_html__(
                    'Add custom HTML or JavaScript code to insert it globally on every page in <header> and <footer>. Insert Google Analytics, Tag Manager, Kissmetrics or other JavaScript code snippets.',
                    'visualcomposer'
                )
            );
        };

        $this->addSection(
            [
                'title' => __('Custom HTML and JavaScript', 'visualcomposer'),
                'slug' => 'settingsGlobalJs',
                'page' => $this->slug,
                'callback' => $sectionCallback,
            ]
        );

        $globalJsSettings = [
            [
                'slug' => 'settingsGlobalJsHead',
                'value' => $optionsHelper->get('settingsGlobalJsHead'),
            ],
            [
                'slug' => 'settingsGlobalJsFooter',
                'value' => $optionsHelper->get('settingsGlobalJsFooter'),
            ],
        ];

        $outputHelper = vchelper('Output');

        foreach ($globalJsSettings as $globalSetting) {
            $fieldCallback = function ($data) use ($globalSetting, $outputHelper) {
                $outputHelper->printNotEscaped($this->call('renderEditor', ['data' => $data, 'globalSetting' => $globalSetting]));
            };

            $this->addField(
                [
                    'page' => $this->slug,
                    'slug' => 'settingsGlobalJs',
                    'name' => $globalSetting['slug'],
                    'id' => $globalSetting['slug'],
                    'fieldCallback' => $fieldCallback,
                    'args' => [
                        'class' => 'vcv-css-js-editor vcv-js-editor-' . $globalSetting['slug'],
                    ],
                ]
            );
        }
    }

    /**
     * Make sure the current user is allowed to manage custom HTML/JavaScript.
     *
     * When the "unfiltered_html" capability is missing we still render the
     * section, but replace the fields with a notice explaining what is needed.
     *
     * @return bool True when the user may manage the editor fields.
     */
    protected function hasUnfilteredHtmlAccess()
    {
        $currentUserAccessHelper = vchelper('AccessCurrentUser');
        if ($currentUserAccessHelper->hasUserCap('unfiltered_html')) {
            return true;
        }

        $sectionCallback = function () {
            echo sprintf(
                '<p class="description">%s</p>',
                esc_html__(
                    'To manage this section you need to have the "unfiltered_html" capability. Please contact your site administrator to enable it for your user.',
                    'visualcomposer'
                )
            );
        };

        $this->addSection(
            [
                'title' => __('Custom HTML and JavaScript', 'visualcomposer'),
                'slug' => 'settingsGlobalJs',
                'page' => $this->slug,
                'callback' => $sectionCallback,
            ]
        );

        return false;
    }

    /**
     * Prevent users from saving unescaped scripts into the global
     * HTML/JavaScript settings.
     *
     * @param string $value
     * @param string $option Full option name passed by the sanitize_option filter.
     *
     * @return string
     */
    protected function sanitizeGlobalJs($value, $option = '')
    {
        $currentUserAccessHelper = vchelper('AccessCurrentUser');

        if (!$currentUserAccessHelper->wpAll('manage_options')->get()) {
            return $option === '' ? $value : get_option($option, '');
        }

        if ($currentUserAccessHelper->hasUserCap('unfiltered_html')) {
            return $value;
        }

        return wp_kses($value, []);
    }

    protected function renderEditor($data, $globalSetting)
    {
        return vcview(
            'settings/fields/js-editor/js-editor',
            [
                'globalSetting' => $globalSetting,
            ]
        );
    }

    protected function enqueueAssets()
    {
        if (function_exists('wp_enqueue_code_editor')) {
            wp_enqueue_code_editor(['type' => 'text/javascript']);
            wp_enqueue_script('htmlhint');
            wp_enqueue_script('csslint');
            wp_enqueue_script('jshint');
        }
    }
}
