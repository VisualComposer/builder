<?php

namespace VisualComposer\Helpers\Settings;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Helper;
use VisualComposer\Helpers\Hub\Update;
use VisualComposer\Helpers\License;
use VisualComposer\Helpers\Options;

class TabsRegistry extends Container implements Helper
{
    private static $tabs = [];

    protected $dataHelper;

    /**
     * Menu items tree list.
     * We change it when want to change position item in plugin settings menu.
     *
     * @var array
     */
    public $menuTree = [
        'vcv-settings' => [
            'vcv-maintenance-mode',
            'vcv-system-status',
            'vcv-license',
        ],
        'vcv-headers-footers' => [
            'vcv_layouts',
            'vcv_headers',
            'vcv_footers',
            'vcv_sidebars',
        ],
        'vcv-font-manager',
        'vcv_templates',
        'vcv-custom-site-popups' => [
            'vcv_popups',
        ],
        'vcv-role-manager',
        'vcv-import',
        'vcv-global-css-js',
        'vcv-hub',
        'vcv-getting-started',
    ];

    public function __construct(License $licenseHelper, Options $optionsHelper, Update $updateHelper)
    {
        if (!$licenseHelper->isPremiumActivated() || $licenseHelper->isThemeActivated()) {
            $this->menuTree[] = 'vcv-activate-license';
        }

        if (
            ($licenseHelper->isPremiumActivated() || $optionsHelper->get('agreeHubTerms'))
            && $optionsHelper->get('bundleUpdateRequired')
        ) {
            $actions = $updateHelper->getRequiredActions();
            if (!empty($actions['actions']) || !empty($actions['posts'])) {
                $this->menuTree[] = 'vcv-update';
            }
        }

        $this->menuTree = apply_filters('vcv:helpers:settings:menuTree', $this->menuTree);

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

    /**
     * Get menu items in hierarchical order.
     *
     * @param array $tabs
     *
     * @return array
     */
    public function getHierarchy($tabs)
    {
        $hierarchy = [];

        foreach ($this->menuTree as $slug => $item) {
            if (is_array($item)) {
                $indexParent = array_search($slug, array_column($tabs, 'slug'));

                if ($indexParent === false) {
                    continue;
                }

                $hierarchy = $this->getGroupHierarchyItem($hierarchy, $tabs, $slug, $item, $indexParent);
            } else {
                $index = array_search($item, array_column($tabs, 'slug'));

                if ($index === false) {
                    continue;
                }

                $hierarchy[$item] = $tabs[$index];
            }
        }

        return $hierarchy;
    }

    /**
     * Add group items to menu hierarchy.
     *
     * @param array $hierarchy
     * @param array $tabs
     * @param string $slug
     * @param integer $indexParent
     * @param array $item
     * @param integer $indexParent
     *
     * @return array
     */
    public function getGroupHierarchyItem($hierarchy, $tabs, $slug, $item, $indexParent)
    {
        $hierarchy[$slug] = $tabs[$indexParent];

        $hierarchy[$slug]['children'][$slug] = $tabs[$indexParent];

        foreach ($item as $subItemSlug) {
            $indexChild = array_search($subItemSlug, array_column($tabs, 'slug'));

            if ($indexChild === false) {
                continue;
            }

            $hierarchy[$slug]['children'][$subItemSlug] = $tabs[$indexChild];
        }

        return $hierarchy;
    }
}
