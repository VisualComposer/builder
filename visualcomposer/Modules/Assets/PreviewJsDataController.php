<?php

namespace VisualComposer\Modules\Assets;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Access\CurrentUser;
use VisualComposer\Helpers\Frontend;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;

class PreviewJsDataController extends Container implements Module
{
    use EventsFilters;

    public function __construct(Frontend $frontendHelper)
    {
        if ($frontendHelper->isPreview()) {
            $this->addFilter(
                'vcv:dataAjax:setData',
                'setData'
            );
        }
    }

    protected function setData($response, $payload)
    {
        $sourceId = $payload['sourceId'];
        $preview = wp_get_post_autosave($sourceId);
        if (is_object($preview)) {
            $sourceId = $preview->ID;
        }
        $this->setPreviewLocalJs($sourceId);
        $this->setPreviewGlobalJs($sourceId);

        return $response;
    }

    protected function setPreviewLocalJs($previewId)
    {
        $requestHelper = vchelper('Request');
        $localJsInput = $requestHelper->input('vcv-settings-source-local-js', '');
        update_metadata('post', $previewId, '_' . VCV_PREFIX . 'preview-settingsLocalJs', $localJsInput);
    }

    protected function setPreviewGlobalJs($previewId)
    {
        $requestHelper = vchelper('Request');
        $globalJsInput = $requestHelper->input('vcv-settings-global-js', '');
        update_metadata('post', $previewId, '_' . VCV_PREFIX . 'preview-settingsGlobalJs', $globalJsInput);
    }
}
