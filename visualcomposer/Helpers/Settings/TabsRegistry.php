<?php

namespace VisualComposer\Helpers\Settings;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Helper;

class TabsRegistry extends Container implements Helper
{
    private static $tabs = [];

    protected $dataHelper;

    public function __construct()
    {
        $this->dataHelper = vchelper('Data');
    }

    public function set($value)
    {
        self::$tabs[] = $value;
    }

    public function get($slug)
    {
        return $this->dataHelper->arraySearch($this->all(), 'slug', $slug);
    }

    public function all()
    {
        return vcfilter('vcv:helper:tabsRegistry:all', self::$tabs);
    }

    public function getHierarchy($tabs)
    {
        $allTabs = $tabs;
        $hierarchyArray = [];
        foreach ($allTabs as $key => $value) {
            $slug = $value['slug'];
            if (isset($value['parent']) && $value['parent'] !== false) {
                $parentSlug = $value['parent'];
                if ($slug === $parentSlug) {
                    $hierarchyArray[ $slug ] = $value;
                }
                // In case if children was registered before parent (or parent doesn't exists)
                if (!isset($hierarchyArray[ $parentSlug ])) {
                    continue;
                }
                $hierarchyArray[ $parentSlug ]['children'][ $slug ] = $value;
            } else {
                $hierarchyArray[ $slug ] = $value;
            }
        }

        return $hierarchyArray;
    }
}
