<?php

namespace VisualComposer\Modules\Editors\Settings;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Url;
use VisualComposer\Helpers\Utm;
use VisualComposer\Modules\Settings\Traits\Fields;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

/**
 * Class ItemBadgeController
 * @package VisualComposer\Modules\Editors\Settings
 */
class ItemBadgeController extends Container implements Module
{
    use Fields;
    use WpFiltersActions;
    use EventsFilters;

    protected $slug = 'vcv-settings';

    public function __construct()
    {
        $this->optionGroup = $this->slug;
        $this->optionSlug = 'vcv-settings-item-badge-enabled';

        $this->wpAddAction(
            'admin_init',
            'buildPage',
            50
        );

        $this->wpAddAction('wp_footer', 'addBadgeCss');
        $this->wpAddAction('wp_footer', 'addBadgeHtml');
    }

    protected function buildPage()
    {
        $sectionCallback = function () {
            echo sprintf(
                '<p class="description">%s</p>',
                esc_html__(
                    'Let the world know that you are proudly using Visual Composer on your website.',
                    'visualcomposer'
                )
            );
        };
        $this->addSection(
            [
                'title' => __('"Created with Visual Composer" Badge', 'visualcomposer'),
                'page' => $this->slug,
                'callback' => $sectionCallback,
            ]
        );

        $fieldCallback = function () {
            /** @see \VisualComposer\Modules\Editors\Settings\itemBadgeEnabled::renderToggle */
            $outputHelper = vchelper('Output');
            $outputHelper->printNotEscaped($this->call('renderToggle', ['value' => true]));
        };

        $this->addField(
            [
                'page' => $this->slug,
                'title' => __('Add badge', 'visualcomposer'),
                'name' => 'settings-item-badge-enabled',
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
        $isEnabled = (bool)$optionsHelper->get('settings-item-badge-enabled');

        return vcview(
            'settings/fields/toggle',
            [
                'name' => $this->optionSlug,
                'value' => $value,
                'isEnabled' => $isEnabled,
            ]
        );
    }

    /**
     * @param \VisualComposer\Helpers\Options $optionsHelper
     * @param \VisualComposer\Helpers\Url $urlHelper
     * @param \VisualComposer\Helpers\Utm $utmHelper
     */
    protected function addBadgeHtml(Options $optionsHelper, Url $urlHelper, Utm $utmHelper)
    {
        $isEnabled = (bool)$optionsHelper->get('settings-item-badge-enabled');
        $badgeUrl = $urlHelper->assetUrl('images/created-with-badge.svg');

        if ($isEnabled) {
            echo '<a class="vcv-settings-badge" target="_blank" href=' . esc_url($utmHelper->get('created-with-badge-button')) . ' rel="noopener noreferrer"><img src="' . esc_url($badgeUrl)
                . '" alt="Created with Visual Composer" /></a>';
        }
    }

    /**
     * @param \VisualComposer\Helpers\Options $optionsHelper
     */
    protected function addBadgeCss(Options $optionsHelper)
    {
        $isEnabled = (bool)$optionsHelper->get('settings-item-badge-enabled');

        if (!$isEnabled) {
            return;
        }

        $css = ' .vcv-settings-badge { display: none; position: fixed; left: -3px; padding: 8px; bottom: 80px; border-radius: 0 6px 6px 0; transition: all 0.2s; cursor: pointer; box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.05); z-index: 99999; background: #fff;}';
        $css .= ' .vcv-settings-badge img { width: 17px;}';
        $css .= ' .vcv-settings-badge:hover {left: 0;box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);}';
        $css .= ' @media screen and (min-width: 768px) {.vcv-settings-badge {  display: block;}}';

        wp_register_style(VCV_PREFIX . ':editor:settings:itemBadge', false);
        wp_enqueue_style(VCV_PREFIX . ':editor:settings:itemBadge');
        wp_add_inline_style(VCV_PREFIX . ':editor:settings:itemBadge', $css);
    }
}
