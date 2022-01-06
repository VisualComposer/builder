<?php

namespace VisualComposer\Modules\Vendors;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class WooCommerceSquareController extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    public function __construct()
    {
        $this->wpAddAction('plugins_loaded', 'initialize', 16);
    }

    protected function initialize()
    {
        if (!class_exists('WooCommerce') || !class_exists('WooCommerce_Square_Loader')) {
            return;
        }

        $this->addFilter(
            'vcv:assets:enqueue:callback:skip',
            function ($result, $payload) {
                $closureInfo = $payload['closureInfo'];
                if ($closureInfo instanceof \ReflectionMethod) {
                    if (
                        !empty($closureInfo->getDeclaringClass()->getName()) &&
                        strpos($closureInfo->getDeclaringClass()->getName(), 'SV_WC_Payment_Gateway')
                    ) {
                        return true;
                    }
                }

                return $result;
            }
        );
    }
}
