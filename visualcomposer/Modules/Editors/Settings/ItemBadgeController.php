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
            echo $this->call('renderToggle', ['value' => true]);
        };

        $this->addField(
            [
                'page' => $this->slug,
                'title' => __('Add badge', 'visualcomposer'),
                'name' => 'settings-item-badge-enabled',
                'id' => $this->optionSlug,
                'fieldCallback' => $fieldCallback
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
        $isEnabled = (bool)$optionsHelper->get('settings-item-badge-enabled', false);

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
     *
     * @return mixed|string
     */
    protected function addBadgeHtml(Options $optionsHelper, Url $urlHelper, Utm $utmHelper)
    {
        $isEnabled = (bool)$optionsHelper->get('settings-item-badge-enabled', false);
        $badgeUrl = $urlHelper->assetUrl('images/created-with-badge.svg');

        if ($isEnabled) {
            echo '<a class="vcv-settings-badge" target="_blank" href=' . esc_url($utmHelper->get('created-with-badge-button')) . '><img src="' . esc_url($badgeUrl) . '" alt="Created with Visual Composer" /></a>';
        }
    }
}
