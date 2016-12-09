<?php

namespace VisualComposer\Helpers;

use VisualComposer\Framework\Illuminate\Support\Helper;

/**
 * Class WpWidgets
 * @package VisualComposer\Helpers
 */
class WpWidgets implements Helper
{
    /**
     * @var array
     */
    protected $defaultWidgets = [
        'WP_Widget_Pages',
        'WP_Widget_Calendar',
        'WP_Widget_Archives',
        'WP_Widget_Links',
        'WP_Widget_Meta',
        'WP_Widget_Search',
        'WP_Widget_Text',
        'WP_Widget_Categories',
        'WP_Widget_Recent_Posts',
        'WP_Widget_Recent_Comments',
        'WP_Widget_RSS',
        'WP_Widget_Tag_Cloud',
        'WP_Nav_Menu_Widget',
    ];

    /**
     * @return array List of widgets instanceof \Wp_Widget
     */
    public function all()
    {
        /** @var \WP_Widget_Factory $wp_widget_factory */
        global $wp_widget_factory;

        return $wp_widget_factory instanceof \WP_Widget_Factory ? $wp_widget_factory->widgets : [];
    }

    /**
     * @return array
     */
    public function allGrouped()
    {
        $all = $this->all();
        $data = [
            'default' => [],
            'custom' => [],
        ];

        foreach ($all as $widget) {
            if (is_object($widget)) {
                $widgetClass = get_class($widget);
                if ($this->isDefault($widgetClass)) {
                    $data['default'][ $widgetClass ] = $widget;
                } else {
                    $data['custom'][ $widgetClass ] = $widget;
                }
            }
        }

        return $data;
    }

    /**
     * @param $key
     *
     * @return \WP_Widget
     */
    public function get($key)
    {
        /** @var \WP_Widget_Factory $wp_widget_factory */
        global $wp_widget_factory;

        return $this->exists($key) ? $wp_widget_factory->widgets[ $key ] : null;
    }

    /**
     * @param $key
     *
     * @return bool
     */
    public function exists($key)
    {
        /** @var \WP_Widget_Factory $wp_widget_factory */
        global $wp_widget_factory;

        return $wp_widget_factory instanceof \WP_Widget_Factory && array_key_exists($key, $wp_widget_factory->widgets);
    }

    /**
     * @param \VisualComposer\Helpers\Url $urlHelper
     * @param \VisualComposer\Helpers\Nonce $nonceHelper
     *
     * @return string
     */
    public function getWidgetsUrl(Url $urlHelper, Nonce $nonceHelper)
    {
        $url = $urlHelper->ajax(
            [
                'vcv-action' => 'elements:widget:script:adminNonce',
                'vcv-nonce' => $nonceHelper->admin(),
            ]
        );

        return $url;
    }

    /**
     * @param $widgetClass
     *
     * @return bool
     */
    public function isDefault($widgetClass)
    {
        return in_array($widgetClass, $this->defaultWidgets);
    }
}
