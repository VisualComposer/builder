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

class MetaSliderController extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    protected static $slidersCount;

    protected static $slidersIds;

    public function __construct()
    {
        $this->wpAddAction('plugins_loaded', 'initialize', 16);
    }

    protected function initialize(Request $requestHelper)
    {
        if (class_exists('MetaSliderPlugin') && $requestHelper->isAjax()) {
            $this->addFilter(
                'vcv:ajax:elements:ajaxShortcode:adminNonce',
                'addFilters',
                -1
            );
            $this->addFilter(
                'vcv:ajax:elements:ajaxShortcode:adminNonce',
                'replaceIds',
                100
            );
        }
    }

    protected function addFilters($response)
    {
        // identified =  'metaslider_' . $this->id
        //
        $this->wpAddFilter(
            'metaslider_slideshow_output',
            function ($slideshow, $id) {
                if (is_null(self::$slidersIds)) {
                    self::$slidersIds = [];
                }
                self::$slidersIds[] = $id;
                if (is_null(self::$slidersCount)) {
                    self::$slidersCount = 0;
                }
                self::$slidersCount++;

                return $slideshow;
            }
        );

        return $response;
    }

    protected function replaceIds($response)
    {
        if (!is_null(self::$slidersIds)) {
            $x = 0;
            foreach (self::$slidersIds as $id) {
                $x++;
                $newId = time() . '0' . $x . '0' . self::$slidersCount . rand(100, 999);
                $response = str_replace($id, $newId, $response);
            }
        }

        return $response;
    }
}
