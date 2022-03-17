<?php

namespace VisualComposer\Modules\Assets;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class PreviewDataController extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Assets\PreviewDataController::setData */
        $this->wpAddFilter(
            'save_post',
            'setPreviewMetaData',
            10,
            1
        );
    }

    /**
     * Update preview local assets metadata.
     *
     * @param int $previewId
     */
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

    /**
     * Update preview global assets metadata.
     *
     * @param int $sourceId
     */
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

    /**
     * Set preview metadata.
     *
     * @param int $postId
     *
     * @return mixed
     * @throws \ReflectionException
     * @throws \VisualComposer\Framework\Illuminate\Container\BindingResolutionException
     */
    protected function setPreviewMetaData($postId)
    {
        $post = get_post($postId);

        // @codingStandardsIgnoreLine
        if ($post->post_type !== 'revision') {
            return $postId;
        }

        $this->call('updatePreviewGlobalAssets', ['sourceId' => $postId]);
        $this->call('updatePreviewLocalAssets', ['sourceId' => $postId]);

        return $postId;
    }
}
