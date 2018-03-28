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
    public function getElements($raw = false)
    {
        $optionHelper = vchelper('Options');

        $elements = $optionHelper->get('hubElements', []);
        $outputElements = [];
        foreach ($elements as $tag => $element) {
            $data = $element;
            $data = array_merge(
                $data,
                [
                    'bundlePath' => $raw ? $element['bundlePath'] : $this->getElementUrl($element['bundlePath']),
                    'elementPath' => $raw ? $element['elementPath'] : $this->getElementUrl($element['elementPath']),
                    'elementRealPath' => $raw
                        ? $element['elementRealPath']
                        : $this->getElementPath(
                            $element['elementRealPath']
                        ),
                    'assetsPath' => $raw ? $element['assetsPath'] : $this->getElementUrl($element['assetsPath']),
                ]
            );

            $metaData = [];
            if (isset($element['settings']['metaThumbnailUrl'])) {
                $metaData['metaThumbnailUrl'] = $raw
                    ? $element['settings']['metaThumbnailUrl']
                    : $this->getElementUrl(
                        $element['settings']['metaThumbnailUrl']
                    );
            }
            if (isset($element['settings']['metaPreviewUrl'])) {
                $metaData['metaPreviewUrl'] = $raw
                    ? $element['settings']['metaPreviewUrl']
                    : $this->getElementUrl(
                        $element['settings']['metaPreviewUrl']
                    );
            }

            if (!empty($metaData)) {
                $data['settings'] = array_merge(
                    $data['settings'],
                    $metaData
                );
            }

            $outputElements[ $tag ] = $data;
        }

        //        dd($outputElements);

        return $outputElements;
    }

    public function setElements($elements = [])
    {
        $optionHelper = vchelper('Options');

        return $optionHelper->set('hubElements', $elements);
    }

    public function updateElement($key, $prev, $new, $merged)
    {
        $hubBundleHelper = vchelper('HubActionsElementsBundle');
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
        $merged['key'] = $key;
        // $this->getElementUrl($key . '/public/dist/element.bundle.js');
        $merged['bundlePath'] = $key . '/public/dist/element.bundle.js';
        // $this->getElementUrl($key . '/' . $key . '/');
        $merged['elementPath'] = $key . '/' . $key . '/';
        // $this->getElementPath($key . '/' . $key . '/');
        $merged['elementRealPath'] = $key . '/' . $key . '/';
        $merged['assetsPath'] = $merged['elementPath'] . 'public/';
        if (isset($merged['settings'])) {
            if (isset($merged['settings']['metaThumbnailUrl'])) {
                $merged['settings']['metaThumbnailUrl'] = str_replace(
                    '[publicPath]',
                    $merged['assetsPath'],
                    $merged['settings']['metaThumbnailUrl']
                );
            } else {
                $merged['settings']['metaThumbnailUrl'] = '';
            }
            if (isset($merged['settings']['metaPreviewUrl'])) {
                $merged['settings']['metaPreviewUrl'] = str_replace(
                    '[publicPath]',
                    $merged['assetsPath'],
                    $merged['settings']['metaPreviewUrl']
                );
            } else {
                $merged['settings']['metaPreviewUrl'] = '';
            }
        }
        array_walk_recursive($merged, [$this, 'fixDoubleSlash']);

        return $merged;
    }

    public function fixDoubleSlash(&$value)
    {
        $value = preg_replace('/([^:])(\/{2,})/', '$1/', $value);
    }

    public function getElementPath($path = '')
    {
        if (vcvenv('VCV_ENV_DEV_ELEMENTS')) {
            if (preg_match('/devElements\//', $path)) {
                return $path;
            }

            return vcapp()->path() . 'devElements/' . $path;
        }

        $pattern = '/' . VCV_PLUGIN_ASSETS_DIRNAME . '\//';
        if (preg_match($pattern, $path)) {
            return $path;
        }

        return VCV_PLUGIN_ASSETS_DIR_PATH . '/elements/' . ltrim($path, '\\/');
    }

    public function getElementUrl($path = '')
    {
        if (preg_match('/^http/', $path)) {
            return $path;
        }

        if (vcvenv('VCV_ENV_DEV_ELEMENTS')) {
            return VCV_PLUGIN_URL . 'devElements/' . $path;
        }

        $assetsHelper = vchelper('Assets');

        return $assetsHelper->getAssetUrl('/elements/' . ltrim($path, '\\/'));
    }
}
