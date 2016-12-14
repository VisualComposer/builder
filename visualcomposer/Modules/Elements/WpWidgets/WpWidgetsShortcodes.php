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
        $this->addShortcode('vcv_widgets', 'render');
    }

    protected function render($atts, $content, $tag, WpWidgets $widgets)
    {
        $atts = shortcode_atts(
            [
                'key' => '',
                'instance' => '',
                'args' => '',
            ],
            $atts
        );
        $instance = json_decode(rawurldecode($atts['instance']), true);
        if (is_array($instance) && isset($instance['widget-form'])) {
            $instance = $instance['widget-form'][1];
        }
        $args = json_decode(rawurldecode($atts['args']), true);
        $output = $widgets->render($atts['key'], $args, $instance);

        return $output;
    }
}
