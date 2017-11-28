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
                3
            );
        }
    }

    protected function replaceIds($response)
    {
        if (!vcIsBadResponse($response)) {
            if (is_null(self::$slidersCount)) {
                self::$slidersCount = 1;
            } else {
                self::$slidersCount++;
            }
            $patterns = [
                'rev_slider_(\d+)_(\d+)',
            ];
            $time = time() . self::$slidersCount;
            foreach ($patterns as $pattern) {
                $response = preg_replace('/' . $pattern . '/', 'rev_slider_${1}_${2]}_' . $time, $response);
            }
        }

        return $response;
    }
}
