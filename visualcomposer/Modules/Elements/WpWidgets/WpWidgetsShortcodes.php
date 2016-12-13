<?php

namespace VisualComposer\Modules\Elements\WpWidgets;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\WpWidgets;
use VisualComposer\Modules\Elements\Traits\AddShortcodeTrait;

class WpWidgetsShortcodes extends Container implements Module
{
    use EventsFilters;
    use AddShortcodeTrait;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Elements\WpWidgets\WpWidgetsShortcodes::registerShortcode */
        $this->addEvent('vcv:inited', 'registerShortcode');
    }

    protected function registerShortcode()
    {
        /** @see \VisualComposer\Modules\Elements\WpWidgets\WpWidgetsShortcodes::render */
        $this->addShortcode('vcv_widget', 'render');
    }

    protected function render($atts, $content, $tag, WpWidgets $widgets)
    {
        $atts = shortcode_atts(
            [
                'key' => '',
                'value' => '',
            ],
            $atts
        );
        $value = json_decode(rawurldecode($atts['value']), true);
        if (isset($value['widget-form'])) {
            $value = $value['widget-form'][1];
        }
        $output = '';
        if ($widgets->exists($atts['key'])) {
            $output = 'WP_Widget Shortcode';
            $output .= var_export([$atts, $content, $tag], true);
            // TODO:
            $output .= var_export($value, true);
            $output .= 'Exists';
        }

        // Render WP_Widget
        return $output;
    }
}
