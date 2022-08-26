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

    public function getDefaultElements()
    {
        return $this->defaultElements;
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
        $elements = $dbElements;
        if (!$raw) {
            $elements = array_merge($this->thirdPartyElements, $dbElements, $this->defaultElements);
        }
        $usageCount = $optionHelper->get('usageCount', []);
        $outputElements = [];
        foreach ($elements as $tag => $element) {
            $data = $this->loopElement($tag, $element, $usageCount, $raw, $outputElementRealPath);

            $outputElements[ $tag ] = $data;
        }

        return $outputElements;
    }

    protected function loopElement($tag, $data, $usageCount, $raw, $outputElementRealPath)
    {
        if (array_key_exists($tag, $this->defaultElements)) {
            $data['metaIsDefaultElement'] = true;
        }
        if ($raw) {
            $elementRealPath = str_replace('[thirdPartyFullPath]', '', $data['elementRealPath']);
        } else {
            $elementRealPath = $this->getElementPath(
                $data['elementRealPath']
            );
        }
        $data = array_merge(
            $data,
            [
                'bundlePath' => $raw ? $data['bundlePath'] : $this->getElementUrl($data['bundlePath']),
                'elementPath' => $raw ? $data['elementPath'] : $this->getElementUrl($data['elementPath']),
                'elementRealPath' => $elementRealPath,
                'assetsPath' => $raw ? $data['assetsPath'] : $this->getElementUrl($data['assetsPath']),
            ]
        );

        if (!$outputElementRealPath) {
            unset($data['elementRealPath']);
            unset($data['phpFiles']);
        }

        $metaData = [];
        if (isset($data['settings']['metaThumbnailUrl'])) {
            if ($raw) {
                $metaData['metaThumbnailUrl'] = $data['settings']['metaThumbnailUrl'];
            } else {
                $metaData['metaThumbnailUrl'] = $this->getElementUrl(
                    $data['settings']['metaThumbnailUrl']
                );
            }
        }
        if (isset($data['settings']['metaPreviewUrl'])) {
            if ($raw) {
                $metaData['metaPreviewUrl'] = $data['settings']['metaPreviewUrl'];
            } else {
                $metaData['metaPreviewUrl'] = $this->getElementUrl(
                    $data['settings']['metaPreviewUrl']
                );
            }
        }

        if (!empty($metaData)) {
            $data['settings'] = array_merge(
                $data['settings'],
                $metaData
            );
        }

        $data['usageCount'] = isset($usageCount[ $tag ]) ? $usageCount[ $tag ] : 0;

        return $data;
    }

    public function setElements($elements = [])
    {
        $optionHelper = vchelper('Options');

        return $optionHelper->set('hubElements', $elements);
    }

    public function updateElement($key, $prev, $new, $merged)
    {
        $hubBundleHelper = vchelper('HubBundle');
        $hubBundleHelper->setTempBundleFolder(
            VCV_PLUGIN_ASSETS_DIR_PATH . '/temp-bundle-element-' . $key
        );
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
        unset($merged['metaIsElementRemoved']);
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
        if ($this->isDevElements()) {
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

        $elementPath = VCV_PLUGIN_ASSETS_DIR_PATH . '/elements/' . ltrim($path, '\\/');

        return apply_filters('vcv:helpers:hub:elements:getElementPath', $elementPath, $path);
    }

    public function getElementUrl($path = '')
    {
        if (preg_match('/^http/', $path)) {
            return $path;
        }

        if ($this->isDevElements()) {
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
        $url = $assetsHelper->getAssetUrl('/elements/' . ltrim($path, '\\/'));

        return apply_filters('vcv:helpers:hub:elements:getElementUrl', $url, $path);
    }

    /**
     * @param $elementTag
     *
     * @return bool
     */
    public function isElementUsed($elementTag)
    {
        // Find
        // 1. check is element used
        /** @see \VisualComposer\Modules\Hub\Actions\PostUpdateAction::getUpdateablePosts */
        $vcvPosts = new \WP_Query(
            [
                'post_type' => get_post_types(['public' => true], 'names'),
                'post_status' => ['publish', 'pending', 'draft', 'auto-draft'],
                'posts_per_page' => 1, // we just need one page
                'meta_key' => VCV_PREFIX . 'pageContent',
                'meta_value' => rawurlencode('"tag":"' . $elementTag . '"'),
                'meta_compare' => 'LIKE',
                'suppress_filters' => true,
            ]
        );

        // @codingStandardsIgnoreLine
        return $vcvPosts->found_posts > 0;
    }

    /**
     * Conditional check if dev elements version is activated.
     *
     * @return bool
     */
    public function isDevElements()
    {
        $isDevElements = false;
        if (vcvenv('VCV_ENV_DEV_ELEMENTS')) {
            $isDevElements = true;
        }

        return apply_filters('vcv:helpers:hub:isDevElements', $isDevElements);
    }

    /**
     * Collect all element's data from their bundle manifests to the list.
     *
     * @param array $manifests
     * @param string $pathToElementFolder
     * @param string $urlToElementFolder
     *
     * @return array
     * @throws \Exception
     */
    public function readManifests(array $manifests, $pathToElementFolder, $urlToElementFolder)
    {
        $elements = [];
        $fileHelper = vchelper('File');
        foreach ($manifests as $manifestPath) {
            $manifest = json_decode($fileHelper->getContents($manifestPath), true);
            $dirname = dirname($manifestPath);
            $tag = basename($dirname);
            if (!isset($manifest['elements'], $manifest['elements'][ $tag ])) {
                throw new \Exception('Element manifest must SET "TAG":' . $manifestPath);
            }
            $element = $manifest['elements'][ $tag ];
            $element['bundlePath'] = $urlToElementFolder . $tag . '/public/dist/element.bundle.js';
            $element['elementPath'] = $urlToElementFolder . $tag . '/' . $tag . '/';
            $element['elementRealPath'] = $pathToElementFolder . '/' . $tag . '/' . $tag . '/';
            $element['assetsPath'] = $urlToElementFolder . $tag . '/' . $tag . '/public/';
            $element['phpFiles'] = [];
            if (isset($manifest['elements'], $manifest['elements'][ $tag ], $manifest['elements'][ $tag ]['phpFiles'])) {
                $files = $manifest['elements'][ $tag ]['phpFiles'];
                foreach ($files as $index => $filePath) {
                    $manifest['elements'][ $tag ]['phpFiles'][ $index ] = rtrim($element['elementRealPath'], '\\/') . '/' . $filePath;
                }
                unset($index, $filePath);
                $element['phpFiles'] = $manifest['elements'][ $tag ]['phpFiles'];
            }
            $element = json_decode(
                str_replace(
                    '[publicPath]',
                    $urlToElementFolder . $tag . '/' . $tag . '/public',
                    wp_json_encode($element)
                ),
                true
            );

            $elements[ $tag ] = $element;
        }
        unset($manifest, $manifestPath, $tag, $dirname);

        return $elements;
    }
}
