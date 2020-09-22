<?php

namespace VisualComposer\Modules\Editors\Settings;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Modules\Settings\Traits\Fields;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

/**
 * Class ItemDataCollectionControllerController
 * @package VisualComposer\Modules\Editors\Settings
 */
class ItemDataCollectionController extends Container implements Module
{
    use Fields;
    use WpFiltersActions;
    use EventsFilters;

    protected $slug = 'vcv-settings';

    public function __construct()
    {
        $this->optionGroup = $this->slug;
        $this->optionSlug = 'vcv-settings-itemdatacollection-enabled';

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
                    'Help us to improve the plugin by sharing anonymous data about Visual Composer usage. We appreciate your help!',
                    'visualcomposer'
                )
            );
        };
        $this->addSection(
            [
                'title' => __('Help Us Make Visual Composer Better', 'visualcomposer'),
                'page' => $this->slug,
                'callback' => $sectionCallback,
            ]
        );

        $fieldCallback = function () {
            /** @see \VisualComposer\Modules\Editors\Settings\itemDataCollectionEnabled::renderToggle */
            echo $this->call('renderToggle', ['value' => 'itemDataCollectionEnabled']);
        };

        $this->addField(
            [
                'page' => $this->slug,
                'title' => __('Yes, I would like to help', 'visualcomposer'),
                'name' => 'settings-itemdatacollection-enabled',
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
        $isEnabled = (bool)$optionsHelper->get('settings-itemdatacollection-enabled', false);

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
