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
        update_post_meta(
            $previewId,
            '_' . VCV_PREFIX . 'previewSourceAssetsFiles',
            $requestHelper->inputJson('vcv-source-assets-files')
        );
        update_post_meta(
            $previewId,
            '_' . VCV_PREFIX . 'previewSourceCss',
            $requestHelper->input('vcv-source-css')
        );
        update_post_meta(
            $previewId,
            '_' . VCV_PREFIX . 'previewSettingsSourceCustomCss',
            $requestHelper->input('vcv-settings-source-custom-css')
        );
    }

    protected function updatePreviewGlobalAssets($previewId)
    {
        $requestHelper = vchelper('Request');
        // Base css
        update_post_meta(
            $previewId,
            '_' . VCV_PREFIX . 'previewElementsCssData',
            $requestHelper->inputJson('vcv-elements-css-data', '')
        );
        // Other data
        update_post_meta(
            $previewId,
            '_' . VCV_PREFIX . 'previewGlobalElementsCss',
            $requestHelper->input('vcv-global-elements-css', '')
        );
        update_post_meta(
            $previewId,
            '_' . VCV_PREFIX . 'previewSettingsGlobalCss',
            $requestHelper->input('vcv-settings-global-css', '')
        );
    }
}
