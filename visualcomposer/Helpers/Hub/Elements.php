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
    protected $thirdPartyElements = [];

    protected $defaultElements = [];

    public function addElement($key, $data)
    {
        if (!array_key_exists($key, $this->thirdPartyElements)) {
            if (strpos($data['elementRealPath'], VCV_PLUGIN_DIR_PATH) === false) {
                $data['thirdParty'] = true;
                $this->thirdPartyElements[ $key ] = $data;
            } else {
                $this->defaultElements[ $key ] = $data;
            }

            return true;
        }

        return false;
    }

    public function getElements($raw = false, $outputElementRealPath = true)
    {
        $optionHelper = vchelper('Options');
        $dbElements = $optionHelper->get('hubElements', []);
        if (!is_array($dbElements)) {
            $dbElements = [];
        }

        /**
         * Default elements has maximum priority
         * Then Database elements
         * Last one is 3rd party elements
         */
        $elements = array_merge($this->thirdPartyElements, $dbElements, $this->defaultElements);
        $outputElements = [];
        foreach ($elements as $tag => $element) {
            $data = $element;
            if ($raw) {
                $elementRealPath = str_replace('[thirdPartyFullPath]', '', $element['elementRealPath']);
            } else {
                $elementRealPath = $this->getElementPath(
                    $element['elementRealPath']
                );
            }
            $data = array_merge(
                $data,
                [
                    'bundlePath' => $raw ? $element['bundlePath'] : $this->getElementUrl($element['bundlePath']),
                    'elementPath' => $raw ? $element['elementPath'] : $this->getElementUrl($element['elementPath']),
                    'elementRealPath' => $elementRealPath,
                    'assetsPath' => $raw ? $element['assetsPath'] : $this->getElementUrl($element['assetsPath']),
                ]
            );

            if (!$outputElementRealPath) {
                unset($data['elementRealPath']);
                unset($data['phpFiles']);
            }

            $metaData = [];
            if (isset($element['settings']['metaThumbnailUrl'])) {
                if ($raw) {
                    $metaData['metaThumbnailUrl'] = $element['settings']['metaThumbnailUrl'];
                } else {
                    $metaData['metaThumbnailUrl'] = $this->getElementUrl(
                        $element['settings']['metaThumbnailUrl']
                    );
                }
            }
            if (isset($element['settings']['metaPreviewUrl'])) {
                if ($raw) {
                    $metaData['metaPreviewUrl'] = $element['settings']['metaPreviewUrl'];
                } else {
                    $metaData['metaPreviewUrl'] = $this->getElementUrl(
                        $element['settings']['metaPreviewUrl']
                    );
                }
            }

            if (!empty($metaData)) {
                $data['settings'] = array_merge(
                    $data['settings'],
                    $metaData
                );
            }

            $outputElements[ $tag ] = $data;
        }

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
            $merged = $this->updateElementData($key, $merged, $prev, $new);
        }

        return $merged;
    }

    protected function updateElementData($key, $merged, $prev, $new)
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
        if (vcvenv('VCV_ENV_ELEMENTS_FILES_NOGLOB')) {
            if (isset($merged['phpFiles'])) {
                $files = isset($new['phpFiles']) ? $new['phpFiles'] : [];
                $merged['phpFiles'] = [];
                foreach ($files as $index => $filePath) {
                    $merged['phpFiles'][ $index ] = rtrim($merged['elementRealPath'], '\\/') . '/' . $filePath;
                }
                unset($index, $filePath);
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
        }
        if (strpos($path, '[thirdPartyFullPath]') !== false) {
            return str_replace('[thirdPartyFullPath]', '', $path);
        }
        if (file_exists($path) || is_dir($path)) {
            return $path;
        }
        if (strpos($path, VCV_PLUGIN_ASSETS_DIRNAME) !== false) {
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

        if (strpos($path, VCV_PLUGIN_URL) !== false) {
            return $path;
        }
        $uploadDir = wp_upload_dir();
        $url = $uploadDir['baseurl'];
        if (strpos($path, $url) !== false) {
            return $path;
        }

        $assetsHelper = vchelper('Assets');

        return $assetsHelper->getAssetUrl('/elements/' . ltrim($path, '\\/'));
    }
}
