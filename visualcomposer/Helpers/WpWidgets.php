<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

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
        // @codingStandardsIgnoreStart
        /** @var \WP_Widget_Factory $wp_widget_factory */
        global $wp_widget_factory;

        return $wp_widget_factory instanceof \WP_Widget_Factory ? $wp_widget_factory->widgets : [];
        // @codingStandardsIgnoreEnd
    }

    /**
     * @return array
     */
    public function allGrouped()
    {
        $all = $this->all();
        $data = [
            'wpWidgetsDefault' => [],
            'wpWidgetsCustom' => [],
        ];

        foreach ($all as $widget) {
            if (is_object($widget)) {
                $widgetClass = get_class($widget);
                if ($this->isDefault($widgetClass)) {
                    $data['wpWidgetsDefault'][ $widgetClass ] = $widget;
                } else {
                    $data['wpWidgetsCustom'][ $widgetClass ] = $widget;
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
        // @codingStandardsIgnoreStart
        /** @var \WP_Widget_Factory $wp_widget_factory */
        global $wp_widget_factory;

        return $this->exists($key) ? $wp_widget_factory->widgets[ $key ] : null;
        // @codingStandardsIgnoreEnd
    }

    /**
     * @param $key
     *
     * @return bool
     */
    public function exists($key = '')
    {
        // @codingStandardsIgnoreStart
        /** @var \WP_Widget_Factory $wp_widget_factory */
        global $wp_widget_factory;

        return $wp_widget_factory instanceof \WP_Widget_Factory && array_key_exists($key, $wp_widget_factory->widgets);
        // @codingStandardsIgnoreEnd
    }

    /**
     * @param $widgetClass
     *
     * @return bool
     */
    public function isDefault($widgetClass)
    {
        return in_array($widgetClass, $this->defaultWidgets, true);
    }

    public function render($widgetKey, $args, $instance = [])
    {
        $widget = $this->get($widgetKey);
        $output = '';
        if (is_object($widget)) {
            ob_start();
            $args = vcfilter('vcv:helpers:widgets:render', $args, ['widget' => $widget, 'instance' => $instance]);
            $widget->widget($args, $instance);
            $output = ob_get_clean();
        }

        return $output;
    }

    public function form($widgetKey, $instance)
    {
        $instance = array_merge(
            [
                'before_title' => '',
                'after_title' => '',
                'before_widget' => '',
                'after_widget' => '',
                'title' => '',
            ],
            $instance
        );
        $widget = $this->get($widgetKey);
        $form = '';
        if (is_object($widget)) {
            ob_start();
            $widget->number = 1; //
            // @codingStandardsIgnoreLine
            $widget->id_base = 'form'; // Encode input name strictly
            $noform = $widget->form($instance);
            $form = ob_get_clean();
            // In case If Widget doesn't have settings
            if ($noform === 'noform') {
                $form = '';
            }
        }

        return $form;
    }

    public function getTemplateVariables($variables, $widgets)
    {
        // name
        // widgetKey
        // widgets
        // ..
        $variables['widgets'] = [];
        $keys = array_keys($widgets);
        $variables['widgetKey'] = $keys[0];
        if (is_array($widgets)) {
            foreach ($widgets as $widgetKey => $widget) {
                /** @var $widget \WP_Widget */
                $variables['widgets'][] = [
                    'label' => $widget->name,
                    'value' => $widgetKey,
                ];
            }
        }

        return $variables;
    }

    /**
     * @param $tag
     * @param $key
     * @param $instance
     * @param $args
     *
     * @return string
     */
    public function getShortcode($tag, $key, $instance, $args)
    {
        return sprintf(
            '[vcv_widgets tag="%s" key="%s" instance="%s" args="%s"]',
            $tag,
            $key,
            $instance,
            $args
        );
    }

    public function defaultKey($tag)
    {
        $all = $this->allGrouped();
        $class = reset($all[ $tag ]);

        return $class ? get_class($class) : false;
    }
}
