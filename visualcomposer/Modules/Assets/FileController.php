<?php

namespace VisualComposer\Modules\Assets;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Assets;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class FileController extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Assets\FileController::setData */
        $this->addFilter(
            'vcv:dataAjax:setData',
            'generateGlobalElementsCssFile'
        );

        /** @see \VisualComposer\Modules\Assets\FileController::setData */
        $this->addFilter(
            'vcv:dataAjax:setData',
            'generateSourceCssFile'
        );

        /** @see \VisualComposer\Modules\Assets\FileController::deleteSourceAssetsFile */
        $this->wpAddAction(
            'before_delete_post',
            'deleteSourceAssetsFile'
        );
    }

    /**
     * Generate (save to fs and update db) styles bundle.
     *
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @param \VisualComposer\Helpers\Assets $assetsHelper
     *
     * @return bool|string URL to generated bundle.
     */
    protected function generateGlobalElementsCssFile($response, $payload, Options $optionsHelper, Assets $assetsHelper)
    {
        $globalElementsCss = $optionsHelper->get('globalElementsCss', '');
        $globalSettingsCss = $optionsHelper->get('settingsGlobalCss', '');
        $bundleUrl = $assetsHelper->updateBundleFile($globalElementsCss . $globalSettingsCss, 'global-elements.css');
        $optionsHelper->set('globalElementsCssFileUrl', $bundleUrl);
        $response['globalBundleCssFileUrl'] = $bundleUrl;

        return $response;
    }

    /**
     *
     * Generate (save to fs and update db) post styles bundle.
     *
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\Assets $assetsHelper
     *
     * @return bool|string URL to generated bundle.
     *
     */
    protected function generateSourceCssFile($response, $payload, Assets $assetsHelper)
    {
        $sourceId = $payload['sourceId'];
        $sourceCss = get_post_meta($sourceId, 'vcvSourceCss', true);
        $sourceCustomCss = get_post_meta($sourceId, 'vcvSettingsSourceCustomCss', true);
        $bundleUrl = $assetsHelper->updateBundleFile($sourceCss . $sourceCustomCss, $sourceId . '.source.css');
        update_post_meta($sourceId, 'vcvSourceCssFileUrl', $bundleUrl);
        $response['sourceBundleCssFileUrl'] = $bundleUrl;

        return $response;
    }

    protected function deleteSourceAssetsFile($sourceId, Assets $assetsHelper)
    {
        $extension = $sourceId . '.source.css';
        $assetsHelper->deleteAssetsBundles($extension);

        return true;
    }
}
