<?php

namespace VisualComposer\Modules\Vendors\Gutenberg;

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

/**
 * Class SettingsController
 * @package VisualComposer\Modules\Vendors\Gutenberg
 */
class SettingsController extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;
    use Fields;

    /**
     * SettingsController constructor.
     */
    public function __construct()
    {
        $this->optionSlug = 'vcv-settings-gutenberg-editor-enabled';

        /**
         * @see  \VisualComposer\Modules\Vendors\Gutenberg\SettingsController::buildSettingsPage
         */
        $this->wpAddAction(
            'admin_init',
            'buildSettingsPage',
            30
        );

        /** @see \VisualComposer\Modules\Vendors\Gutenberg\SettingsController::setGutenbergEditor */
        $this->addEvent('vcv:system:activation:hook', 'setGutenbergEditor');

        /** @see \VisualComposer\Modules\Vendors\Gutenberg\SettingsController::unsetOptions */
        $this->addEvent('vcv:system:factory:reset', 'unsetOptions');
    }

    /**
     * Build settings page with Gutenberg toggle
     */
    protected function buildSettingsPage()
    {
        if (!function_exists('the_gutenberg_project') && !function_exists('use_block_editor_for_post')) {
            return;
        }

        $showSettings = true;
        // Check for classic editor plugin
        if (function_exists('classic_editor_init_actions')) {
            if (get_option('classic-editor-replace') !== 'no-replace') {
                $showSettings = false;
            }
        }

        if ($showSettings) {
            $sectionCallback = function () {
                echo sprintf(
                    '<p class="description">%s</p>',
                    esc_html__(
                        'Enable/disable the Gutenberg editor for your WordPress site. Disabling Gutenberg editor will enable classic WordPress editor. In both cases, you can still use Visual Composer.',
                        'visualcomposer'
                    )
                );
            };

            $this->addSection(
                [
                    'title' => __('Gutenberg Editor', 'visualcomposer'),
                    'page' => $this->optionGroup,
                    'callback' => $sectionCallback,
                ]
            );

            $fieldCallback = function () {
                /**
                 * @see \VisualComposer\Modules\Vendors\Gutenberg\SettingsController::renderToggle
                 */
                echo $this->call('renderToggle', ['value' => 'gutenberg-editor']);
            };

            $this->addField(
                [
                    'page' => $this->optionGroup,
                    'title' => __('Gutenberg', 'visualcomposer'),
                    'name' => 'settings-gutenberg-editor-enabled',
                    'id' => $this->optionSlug,
                    'fieldCallback' => $fieldCallback,
                ]
            );
        }
    }

    /**
     * @param $value
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return mixed|string
     */
    protected function renderToggle($value, Options $optionsHelper)
    {
        $isEnabled = (bool)$optionsHelper->get('settings-gutenberg-editor-enabled', true);

        return vcview(
            'settings/fields/toggle',
            [
                'name' => 'vcv-settings-gutenberg-editor-enabled',
                'value' => $value,
                'isEnabled' => $isEnabled,
            ]
        );
    }

    /**
     * Enable Block editor by default
     *
     * @param \VisualComposer\Helpers\Options $optionsHelper
     */
    protected function setGutenbergEditor(Options $optionsHelper)
    {
        // Enable gutenberg by default
        $val = $optionsHelper->get('settings-gutenberg-editor-enabled', 'not-exists');
        if ($val === 'not-exists') {
            $optionsHelper->set('settings-gutenberg-editor-enabled', true);
        }
    }

    /**
     * @param \VisualComposer\Helpers\Options $optionsHelper
     */
    protected function unsetOptions(Options $optionsHelper)
    {
        $optionsHelper->delete('settings-gutenberg-editor-enabled');
    }
}
