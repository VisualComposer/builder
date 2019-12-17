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
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class DataController extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

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

        $this->wpAddAction('update_option_' . VCV_PREFIX . 'settingsGlobalCss', 'updateGlobalCssFromSettings');
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
        $assetsSharedHelper = vchelper('AssetsShared');
        $assetsFiles = $requestHelper->inputJson('vcv-source-assets-files');
        if (!empty($assetsFiles) && is_array($assetsFiles)) {
            if (!empty($assetsFiles['jsBundles'])) {
                $assetsFiles['jsBundles'] = array_map([$assetsHelper, 'relative'], $assetsFiles['jsBundles']);
                $assetsFiles['jsBundles'] = array_map([$assetsSharedHelper, 'relative'], $assetsFiles['jsBundles']);
            }
            if (!empty($assetsFiles['cssBundles'])) {
                $assetsFiles['cssBundles'] = array_map([$assetsHelper, 'relative'], $assetsFiles['cssBundles']);
                $assetsFiles['cssBundles'] = array_map([$assetsSharedHelper, 'relative'], $assetsFiles['cssBundles']);
            }
        }
        update_post_meta($sourceId, 'vcvSourceAssetsFiles', $assetsFiles);
        update_post_meta($sourceId, 'vcvSourceCss', wp_slash($requestHelper->input('vcv-source-css-compiled')));
        update_post_meta(
            $sourceId,
            'vcvSettingsSourceCustomCss',
            wp_slash($requestHelper->input('vcv-settings-source-custom-css'))
        );
    }

    protected function updateGlobalAssets($sourceId)
    {
        $optionsHelper = vchelper('Options');
        $requestHelper = vchelper('Request');
        // Base css
        $elementsCssData = $requestHelper->inputJson('vcv-elements-css-data', '');

        update_post_meta($sourceId, VCV_PREFIX . 'globalElementsCssData', wp_slash($elementsCssData));
        // Other data
        $optionsHelper->set('globalElementsCss', $requestHelper->input('vcv-global-css-compiled'));
        $optionsHelper->set('settingsGlobalCss', $requestHelper->input('vcv-settings-global-css'));
    }

    protected function updateGlobalCssFromSettings(Request $requestHelper, Options $optionsHelper)
    {
        if (
            $requestHelper->input('vcv-settingsGlobalCss-compiled', 'not-changed') !== 'not-changed'
            && $requestHelper->exists(VCV_ADMIN_AJAX_REQUEST)
            && $requestHelper->input('vcv-action') === 'settings:save:adminNonce'
        ) {
            // Save Request from vcv-settings page custom-css tab
            $optionsHelper->set('globalElementsCss', $requestHelper->input('vcv-settingsGlobalCss-compiled'));
        }
    }
}
