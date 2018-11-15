<?php

namespace VisualComposer\Modules\Utm;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Utm as UtmHelper;
use VisualComposer\Helpers\Traits\EventsFilters;

class Utm extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Utm\Utm::outputUtm */
        $this->addFilter(
            'vcv:frontend:head:extraOutput vcv:update:extraOutput',
            'outputUtm'
        );
    }

    protected function outputUtm($response, $payload, UtmHelper $utmHelper)
    {
        $response = array_merge(
            $response,
            [
                vcview(
                    'partials/constant-script',
                    [
                        'key' => 'VCV_UTM',
                        'value' => $utmHelper->all(),
                    ]
                ),
            ]
        );

        return $response;
    }
}
