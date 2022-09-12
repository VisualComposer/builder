<?php

namespace VisualComposer\Modules\Vendors;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class RevSliderController extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    protected static $slidersCount;

    public function __construct()
    {
        $this->wpAddAction('plugins_loaded', 'initialize', 16);
    }

    protected function initialize(Request $requestHelper)
    {
        if (class_exists('RevSlider') && $requestHelper->isAjax()) {
            $this->addFilter(
                'vcv:ajax:elements:ajaxShortcode:adminNonce',
                'replaceIds',
                -1
            );
        }
    }

    protected function replaceIds($response)
    {
        add_filter(
            'revslider_modify_slider_settings',
            function ($settings) {
                if (is_null(self::$slidersCount)) {
                    self::$slidersCount = 1;
                } else {
                    self::$slidersCount++;
                }
                $time = time() . self::$slidersCount . wp_rand(100, 999);
                if (!is_array($settings)) {
                    $settings = [];
                }
                if (isset($settings['slider_id'])) {
                    $settings['slider_id'] = 'rev_slider-' . $settings['slider_id'] . $time;
                } else {
                    $settings['slider_id'] = 'rev_slider-' . $time;
                }

                return $settings;
            }
        );

        return $response;
    }
}
