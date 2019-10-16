<?php

namespace VisualComposer\Helpers\Settings;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Helper;

/**
 * Implements the Registry design pattern for storing visual composer settings sections
 * Class SectionsRegistry.
 */
class SectionsRegistry extends Container implements Helper
{
    private static $sections = [];

    public function set($key, $value)
    {
        self::$sections[ $key ] = $value;
    }

    public function get($key)
    {
        return isset(self::$sections[ $key ]) ? self::$sections[ $key ] : null;
    }

    public function all()
    {
        return self::$sections;
    }

    public function findBySlug($slug, $key = 'group')
    {
        $all = $this->all();
        $result = array_filter(
            $all,
            function ($item) use ($slug, $key) {
                return $item[ $key ] === $slug;
            }
        );

        return $result;
    }

    public function getHiearchy($sections)
    {
        $buildTree = function ($buildTree, array $elements, $parentId = null) {
            $branch = [];

            foreach ($elements as $key => $element) {
                $isset = isset($element['vcv-args']['parent']);
                if ((!$isset && !$parentId) || ($isset && $element['vcv-args']['parent'] === $parentId)) {
                    $children = $buildTree($buildTree, $elements, $element['slug']);
                    if ($children) {
                        $element['children'] = $children;
                    }
                    $branch[ $key ] = $element;
                }
            }

            return $branch;
        };

        $orderedSections = $buildTree($buildTree, $sections, null);

        return $orderedSections;
    }
}
