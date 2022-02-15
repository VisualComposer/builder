<?php

namespace VisualComposer\Modules\Editors\Attributes\PageDesignOptions;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;

class Controller extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        $this->addFilter('vcv:dataAjax:getData', 'getDataPageDesignOptions');
    }

    protected function getDataPageDesignOptions($response, $payload)
    {
        $response['pageDesignOptions'] = get_post_meta(
            $payload['sourceId'],
            '_' . VCV_PREFIX . 'pageDesignOptionsData',
            true
        );

        return $response;
    }
}
