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
     * @return string
     */
    public function getWidgetsUrl()
    {
        $url = vchelper('Url')->ajax(
            [
                'vcv-action' => 'elements:widget:script:adminNonce',
                'vcv-nonce' => vchelper('Nonce')->admin(),
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

    public function render($widgetKey, $args, $instance = [])
    {
        $widget = $this->get($widgetKey);
        $output = '';
        if (is_object($widget)) {
            ob_start();
            $widget->widget($args, $instance);
            $output = ob_get_clean();
        }

        return $output;
    }

    public function form($widgetKey, $instance)
    {
        $widget = $this->get($widgetKey);
        $form = '';
        if (is_object($widget)) {
            ob_start();
            $widget->number = 1; //
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
        foreach ($widgets as $widgetKey => $widget) {
            /** @var $widget \WP_Widget */
            $variables['widgets'][] = [
                'label' => $widget->name,
                'value' => $widgetKey,
            ];
        }

        return $variables;
    }

    public function compileTemplate($template, $tag, $templateVariables)
    {
        $compiledTemplate = $template;
        // Webpack: unset ID
        $compiledTemplate = preg_replace(
            '/webpackJsonp\(\[\d+\]/',
            'webpackJsonp([\'' . $tag . '\']',
            $compiledTemplate
        );
        // Other variables
        foreach ($templateVariables as $variableKey => $variableValue) {
            $encodedValue = is_string($variableValue) ? $variableValue : json_encode($variableValue);
            $compiledTemplate = str_replace('{' . $variableKey . '}', $encodedValue, $compiledTemplate);
            $compiledTemplate = str_replace('"{+' . $variableKey . '+}"', $encodedValue, $compiledTemplate);
        }

        return $compiledTemplate;
    }
}
