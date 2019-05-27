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

class PreviewDataController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Assets\PreviewDataController::setData */
        $this->addFilter(
            'vcv:dataAjax:setData',
            'setData'
        );
    }

    protected function setData($response, $payload, Frontend $frontendHelper)
    {
        $sourceId = $payload['sourceId'];
        if ($frontendHelper->isPreview()) {
            $preview = wp_get_post_autosave($sourceId);
            if (is_object($preview)) {
                $sourceId = $preview->ID;
            }
            $this->updatePreviewLocalAssets($sourceId);
            $this->updatePreviewGlobalAssets($sourceId);
        }

        return $response;
    }

    protected function updatePreviewLocalAssets($previewId)
    {
        $requestHelper = vchelper('Request');
        update_metadata(
            'post',
            $previewId,
            '_' . VCV_PREFIX . 'previewSourceAssetsFiles',
            $requestHelper->inputJson('vcv-source-assets-files')
        );
        update_metadata(
            'post',
            $previewId,
            '_' . VCV_PREFIX . 'previewSourceCss',
            $requestHelper->input('vcv-source-css-compiled')
        );
    }

    protected function updatePreviewGlobalAssets($sourceId)
    {
        $requestHelper = vchelper('Request');
        // Base css
        update_metadata(
            'post',
            $sourceId,
            '_' . VCV_PREFIX . 'previewElementsCssData',
            $requestHelper->inputJson('vcv-elements-css-data', '')
        );

        update_metadata(
            'post',
            $sourceId,
            '_' . VCV_PREFIX . 'previewGlobalElementsCss',
            $requestHelper->input('vcv-global-css-compiled', '')
        );
    }
}
