<?php

namespace VisualComposer\Modules\Assets;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Frontend;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;

class JsDataController extends Container implements Module
{
    use EventsFilters;

    public function __construct(Frontend $frontendHelper)
    {
        $this->addFilter(
            'vcv:dataAjax:getData',
            'getData'
        );
        if (!$frontendHelper->isPreview()) {
            $this->addFilter(
                'vcv:dataAjax:setData',
                'setData'
            );
        }
    }

    protected function getData($response, $payload, Options $optionsHelper)
    {
        $sourceId = $payload['sourceId'];
        $sourceLocalJs = get_post_meta($sourceId, VCV_PREFIX . 'settingsLocalJs', true);
        $response['jsSettings'] = [
            'local' => $sourceLocalJs ? $sourceLocalJs : '',
            'global' => $optionsHelper->get('settingsGlobalJs', ''),
        ];

        return $response;
    }

    protected function setData($response, $payload)
    {
        $sourceId = $payload['sourceId'];
        $this->setSourceJs($sourceId);
        $this->setGlobalJs();

        return $response;
    }

    protected function setSourceJs($sourceId)
    {
        $requestHelper = vchelper('Request');
        $jsInput = $requestHelper->input('vcv-settings-source-local-js', '');
        update_post_meta($sourceId, VCV_PREFIX . 'settingsLocalJs', $jsInput);
    }

    protected function setGlobalJs()
    {
        // save global options
        $requestHelper = vchelper('Request');
        $optionsHelper = vchelper('Options');
        $jsInput = $requestHelper->input('vcv-settings-global-js', '');
        $optionsHelper->set('settingsGlobalJs', $jsInput);
    }
}
