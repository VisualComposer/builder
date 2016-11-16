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
}
