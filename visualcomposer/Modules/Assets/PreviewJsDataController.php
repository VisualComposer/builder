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
use VisualComposer\Helpers\Traits\EventsFilters;

class PreviewJsDataController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        $this->addFilter(
            'vcv:dataAjax:setData',
            'setData'
        );
    }

    protected function setData($response, $payload, Frontend $frontendHelper)
    {
        if ($frontendHelper->isPreview()) {
            $sourceId = vchelper('Preview')->updateSourceIdWithPreviewId($payload['sourceId']);
            $this->setPreviewLocalJs($sourceId);
            $this->setPreviewGlobalJs($sourceId);
        }

        return $response;
    }

    protected function setPreviewLocalJs($previewId)
    {
        $requestHelper = vchelper('Request');
        $localJsInputHead = $requestHelper->input('vcv-settings-source-local-head-js', '');
        update_metadata('post', $previewId, '_' . VCV_PREFIX . 'preview-settingsLocalJsHead', $localJsInputHead);
        $localJsInputFooter = $requestHelper->input('vcv-settings-source-local-footer-js', '');
        update_metadata('post', $previewId, '_' . VCV_PREFIX . 'preview-settingsLocalJsFooter', $localJsInputFooter);
    }

    protected function setPreviewGlobalJs($previewId)
    {
        $requestHelper = vchelper('Request');
        $globalJsInputHead = $requestHelper->input('vcv-settings-global-head-js', '');
        update_metadata('post', $previewId, '_' . VCV_PREFIX . 'preview-settingsGlobalJsHead', $globalJsInputHead);

        $globalJsInputFooter = $requestHelper->input('vcv-settings-global-footer-js', '');
        update_metadata('post', $previewId, '_' . VCV_PREFIX . 'preview-settingsGlobalJsFooter', $globalJsInputFooter);
    }
}
