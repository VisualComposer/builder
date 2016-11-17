<?php

namespace VisualComposer\Helpers;

use VisualComposer\Framework\Illuminate\Support\Helper;

class WpWidgets implements Helper
{
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

    public function getWidgetUrl($widgetKey, Url $urlHelper, Nonce $nonceHelper)
    {
        $url = $urlHelper->ajax(
            [
                'vcv-action' => 'elements:widget:script:adminNonce',
                'vcv-widget-key' => $widgetKey,
                'vcv-nonce' => $nonceHelper->admin(),
            ]
        );

        return $url;
    }
}
