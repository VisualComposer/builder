<?php

namespace VisualComposer\Modules\Editors\Attributes\PageDesignOptions;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;

class Controller extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        $this->addFilter('vcv:dataAjax:setData', 'setDataSavePageDesignOptions');
        $this->addFilter('vcv:dataAjax:getData', 'getDataPageDesignOptions');
    }

    protected function setDataSavePageDesignOptions($response, $payload, Request $requestHelper)
    {
        update_post_meta(
            $payload['sourceId'],
            '_' . VCV_PREFIX . 'pageDesignOptionsData',
            $requestHelper->input('vcv-settings-page-design-options')
        );
        update_post_meta(
            $payload['sourceId'],
            '_' . VCV_PREFIX . 'pageDesignOptionsCompiledCss',
            $requestHelper->input('vcv-settings-page-design-options-compiled')
        );

        return $response;
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
