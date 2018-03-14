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

class DataController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Assets\DataController::getData */
        $this->addFilter(
            'vcv:dataAjax:getData',
            'getData'
        );
        /** @see \VisualComposer\Modules\Assets\DataController::setData */
        $this->addFilter(
            'vcv:dataAjax:setData',
            'setData'
        );
    }

    protected function getData($response, $payload, Options $optionsHelper)
    {
        $sourceId = $payload['sourceId'];

        $postCustomCss = get_post_meta($sourceId, 'vcvSettingsSourceCustomCss', true);
        $response['cssSettings'] = [
            'custom' => $postCustomCss ? $postCustomCss : '',
            'global' => $optionsHelper->get('settingsGlobalCss', ''),
        ];
        $response['globalElements'] = $optionsHelper->get('globalElements', '');

        return $response;
    }

    protected function setData($response, $payload, Frontend $frontendHelper)
    {
        $sourceId = $payload['sourceId'];
        if (!$frontendHelper->isPreview()) {
            $this->updateSourceAssets($sourceId);
            $this->updateGlobalAssets($sourceId);
        }

        return $response;
    }

    protected function updateSourceAssets($sourceId)
    {
        $requestHelper = vchelper('Request');
        $assetsHelper = vchelper('Assets');
        $assetsFiles = $requestHelper->inputJson('vcv-source-assets-files');
        if (!empty($assetsFiles) && is_array($assetsFiles)) {
            if (!empty($assetsFiles['jsBundles'])) {
                $assetsFiles['jsBundles'] = array_map([$assetsHelper, 'relative'], $assetsFiles['jsBundles']);
            }
            if (!empty($assetsFiles['cssBundles'])) {
                $assetsFiles['cssBundles'] = array_map([$assetsHelper, 'relative'], $assetsFiles['cssBundles']);
            }
        }
        update_post_meta($sourceId, 'vcvSourceAssetsFiles', $assetsFiles);
        update_post_meta($sourceId, 'vcvSourceCss', $requestHelper->input('vcv-source-css'));
        update_post_meta(
            $sourceId,
            'vcvSettingsSourceCustomCss',
            $requestHelper->input('vcv-settings-source-custom-css')
        );
    }

    protected function updateGlobalAssets($sourceId)
    {
        $optionsHelper = vchelper('Options');
        $requestHelper = vchelper('Request');
        // Base css
        $elementsCssData = $requestHelper->inputJson('vcv-elements-css-data', '');

        update_post_meta($sourceId, VCV_PREFIX . 'globalElementsCssData', $elementsCssData);
        // Other data
        $optionsHelper->set('globalElementsCss', $requestHelper->input('vcv-global-elements-css'));
        $optionsHelper->set('settingsGlobalCss', $requestHelper->input('vcv-settings-global-css'));
    }
}
