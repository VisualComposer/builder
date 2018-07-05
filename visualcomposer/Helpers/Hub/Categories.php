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
    protected $thirdPartyCategoriesElements = [];

    public function addCategoryElements($category, $elements)
    {
        if (!isset($this->thirdPartyCategoriesElements[ $category ])) {
            $this->thirdPartyCategoriesElements[ $category ] = ['elements' => []];
        }
        $this->thirdPartyCategoriesElements[ $category ]['elements'] = array_merge(
            $this->thirdPartyCategoriesElements[ $category ]['elements'],
            $elements
        );
    }

    public function getCategories()
    {
        $optionHelper = vchelper('Options');
        $categoriesDiffer = vchelper('Differ');
        $hubCategories = $optionHelper->get('hubCategories', []);
        $categoriesDiffer->set($hubCategories);

        $categoriesDiffer->onUpdate(
            function ($key, $oldValue, $newValue, $mergedValue) {
                if (empty($oldValue)) {
                    return []; // Do not allow to create 'new' categories
                }
                $mergedValue['elements'] = array_unique(array_merge($oldValue['elements'], $newValue['elements']));

                return $mergedValue;
            }
        )->set(
            $this->thirdPartyCategoriesElements
        );
        $new = $categoriesDiffer->get();

        return $new;
    }

    public function setCategories($categories = [])
    {
        $optionHelper = vchelper('Options');

        return $optionHelper->set('hubCategories', $categories);
    }

    public function updateCategory($key, $prev, $new, $merged)
    {
        $categoryUrl = rtrim($this->getCategoriesUrl(), '\\/');
        if (isset($merged['icon'])) {
            $merged['icon'] = str_replace(
                '[publicPath]',
                $categoryUrl,
                $merged['icon']
            );
        }
        if (isset($merged['icon'])) {
            $merged['iconDark'] = str_replace(
                '[publicPath]',
                $categoryUrl,
                $merged['iconDark']
            );
        }

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
