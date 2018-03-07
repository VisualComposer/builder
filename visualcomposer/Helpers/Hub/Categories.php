<?php

namespace VisualComposer\Helpers\Hub;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;

class Categories implements Helper
{
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

    public function getCategoriesPath($key = '')
    {
        return VCV_PLUGIN_ASSETS_DIR_PATH . '/categories/' . ltrim($key, '\\/');
    }

    public function getCategoriesUrl($key = '')
    {
        $assetsHelper = vchelper('Assets');

        return $assetsHelper->getAssetUrl('/categories/' . ltrim($key, '\\/'));
    }
}
