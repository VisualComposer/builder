<?php

namespace VisualComposer\Helpers;

use VisualComposer\Framework\Illuminate\Support\Helper;

class Hub implements Helper
{
    public function requestBundleDownload($requestedData = [])
    {
        $urlHelper = vchelper('Url');
        $fileHelper = vchelper('File');
        $downloadUrl = $urlHelper->query(sprintf('%s/download/bundle', VCV_ACCOUNT_URL), $requestedData);
        $downloadedArchive = $fileHelper->download($downloadUrl);

        return $downloadedArchive;
    }

    public function unzipDownloadedBundle($bundle)
    {
        $fileHelper = vchelper('File');
        $result = $fileHelper->unzip($bundle, $this->getBundleFolder(), true);

        return $result;
    }

    public function getBundleFolder($path = '')
    {
        $bundleFolder = WP_CONTENT_DIR . '/' . VCV_PLUGIN_ASSETS_DIRNAME . '/temp-bundle';
        if ($path) {
            $bundleFolder .= '/' . ltrim($path, '\//');
        }

        return $bundleFolder;
    }

    public function readBundleJson($bundleJsonPath)
    {
        $fileHelper = vchelper('File');
        $content = $fileHelper->getContents($bundleJsonPath);

        return json_decode($content, true);
    }

    public function removeBundleFolder()
    {
        $folder = $this->getBundleFolder();
        $fileHelper = vchelper('File');

        return $fileHelper->removeDirectory($folder);
    }

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

    public function getCategories()
    {
        $optionHelper = vchelper('Options');

        return $optionHelper->get('hubCategories', []);
    }

    public function setCategories($categories = [])
    {
        $optionHelper = vchelper('Options');

        return $optionHelper->set('hubCategories', $categories);
    }

    public function getGroups()
    {
        $optionHelper = vchelper('Options');

        return $optionHelper->get(
            'hubGroups',
            [
                'all' =>
                    [
                        'title' => 'All',
                        'categories' => true,
                        'metaOrder' => 1,
                    ],
            ]
        );
    }

    public function setGroups($groups = [])
    {
        $optionHelper = vchelper('Options');

        return $optionHelper->set('hubGroups', $groups);
    }

    public function updateElement($key, $prev, $new, $merged)
    {
        $fileHelper = vchelper('File');
        $result = $fileHelper->copyDirectory($this->getBundleFolder('elements/' . $key), $this->getElementPath($key));
        if (!is_wp_error($result)) {
            $merged = $this->updateElementData($key, $merged);
        }

        return $merged;
    }

    public function updateCategory($key, $prev, $new, $merged)
    {
        $categoryUrl = rtrim($this->getCategoriesUrl(), '\\/');
        $merged['icon'] = str_replace(
            '[publicPath]',
            $categoryUrl,
            $merged['icon']
        );
        $merged['iconDark'] = str_replace(
            '[publicPath]',
            $categoryUrl,
            $merged['iconDark']
        );

        return $merged;
    }

    public function updateGroup($key, $prev, $new, $merged)
    {
        if (!empty($prev)) {
            if (isset($new['categories']) && is_array($new['categories']) && isset($prev['categories'])
            ) {
                $merged['categories'] = array_unique(array_merge($prev['categories'], $new['categories']));
            }
        }

        return $merged;
    }

    protected function updateElementData($key, $merged)
    {
        $merged['bundlePath'] = $this->getElementUrl($key . '/public/dist/element.bundle.js');
        $merged['elementPath'] = $this->getElementUrl($key . '/' . $key);
        $merged['assetsPath'] = $merged['elementPath'] . '/public';
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
        return WP_CONTENT_DIR . '/' . VCV_PLUGIN_ASSETS_DIRNAME . '/elements/' . ltrim($key, '\\/');
    }

    public function getCategoriesPath($key = '')
    {
        return WP_CONTENT_DIR . '/' . VCV_PLUGIN_ASSETS_DIRNAME . '/categories/' . ltrim($key, '\\/');
    }

    public function getElementUrl($key = '')
    {
        return content_url() . '/' . VCV_PLUGIN_ASSETS_DIRNAME . '/elements/' . ltrim($key, '\\/');
    }

    public function getCategoriesUrl($key = '')
    {
        return content_url() . '/' . VCV_PLUGIN_ASSETS_DIRNAME . '/categories/' . ltrim($key, '\\/');
    }
}
