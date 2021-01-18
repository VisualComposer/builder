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

class WooCommerceSquareController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        $this->addFilter(
            'vcv:assets:enqueue:callback:skip',
            function ($result, $payload) {
                $closureInfo = $payload['closureInfo'];
                if ($closureInfo instanceof \ReflectionMethod) {
                    if (strpos($closureInfo->getDeclaringClass(), 'SV_WC_Payment_Gateway') !== false) {
                        return true;
                    }
                }

                return $result;
            }
        );
    }
}
