<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;

/**
 * Class Menu
 * @package VisualComposer\Helpers
 */
class WpMenu implements Helper
{
    /**
     * Return all menus
     *
     * @return array
     */
    public function getMenuList()
    {
        $menuList = get_terms('nav_menu');
        $values[] = [
            'label' => __('Select your menu', 'visualcomposer'),
            'value' => '',
        ];
        foreach ($menuList as $menu) {
            $values[] = [
                'label' => $menu->name,
                'value' => $menu->slug,
            ];
        }

        return ['status' => true, 'data' => $values];
    }

    /**
     * Set menu list variables that we use them in js code.
     *
     * @param array $variables
     *
     * @return array
     */
    public function setMenuListVariables($variables)
    {
        $menuList = $this->getMenuList();

        $variables[] = [
            'key' => 'vcvWpMenus',
            'value' => $menuList['data'],
            'type' => 'variable',
        ];

        return $variables;
    }
}
