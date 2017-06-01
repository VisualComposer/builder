<?php

namespace VisualComposer\Helpers\Hub;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;

class Elements implements Helper
{
    public function getElements()
    {
        $optionHelper = vchelper('Options');

        return $optionHelper->get('hubElements', []);
    }

    public function setElements($elements = [])
    {
        $optionHelper = vchelper('Options');

        return $optionHelper->set('hubElements', $elements);
    }

    public function updateElement($key, $prev, $new, $merged)
    {
        $hubBundleHelper = vchelper('HubBundle');
        $fileHelper = vchelper('File');
        $result = $fileHelper->copyDirectory(
            $hubBundleHelper->getTempBundleFolder('elements/' . $key),
            $this->getElementPath($key)
        );
        if (!is_wp_error($result)) {
            $merged = $this->updateElementData($key, $merged);
        }

        return $merged;
    }

    protected function updateElementData($key, $merged)
    {
        $merged['bundlePath'] = $this->getElementUrl($key . '/public/dist/element.bundle.js');
        $merged['elementPath'] = $this->getElementUrl($key . '/' . $key . '/');
        $merged['assetsPath'] = $merged['elementPath'] . '/public/';
        if (isset($merged['settings'])) {
            $merged['settings']['metaThumbnailUrl'] = str_replace(
                '[publicPath]',
                $merged['assetsPath'],
                $merged['settings']['metaThumbnailUrl']
            );
            $merged['settings']['metaPreviewUrl'] = str_replace(
                '[publicPath]',
                $merged['assetsPath'],
                $merged['settings']['metaPreviewUrl']
            );
        }

        return $merged;
    }

    public function getElementPath($key = '')
    {
        return VCV_PLUGIN_ASSETS_DIR_PATH . '/elements/' . ltrim($key, '\\/');
    }

    public function getElementUrl($key = '')
    {
        return content_url() . '/' . VCV_PLUGIN_ASSETS_DIRNAME . '/elements/' . ltrim($key, '\\/');
    }
}
