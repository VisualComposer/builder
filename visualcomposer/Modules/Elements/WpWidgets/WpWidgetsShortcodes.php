<?php

namespace VisualComposer\Modules\Elements\WpWidgets;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\WpWidgets;
use VisualComposer\Modules\Elements\Traits\AddShortcodeTrait;

/**
 * Class WpWidgetsShortcodes
 * @package VisualComposer\Modules\Elements\WpWidgets
 */
class WpWidgetsShortcodes extends Container implements Module
{
    use EventsFilters;
    use AddShortcodeTrait;
    use WpFiltersActions;

    /**
     * WpWidgetsShortcodes constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\Elements\WpWidgets\WpWidgetsShortcodes::registerShortcode */
        $this->addEvent('vcv:inited', 'registerShortcode');

        /** @see \VisualComposer\Modules\Elements\WpWidgets\WpWidgetsShortcodes::checkWidgetsShortcode */
        $this->wpAddFilter('content_save_pre', 'checkWidgetsShortcode');
    }

    /**
     *
     */
    protected function registerShortcode()
    {
        /** @see \VisualComposer\Modules\Elements\WpWidgets\WpWidgetsShortcodes::render */
        $this->addShortcode('vcv_widgets', 'render');
    }

    /**
     * @param $atts
     * @param $content
     * @param $tag
     * @param \VisualComposer\Helpers\WpWidgets $widgets
     *
     * @return string
     */
    protected function render($atts, $content, $tag, WpWidgets $widgets)
    {
        $atts = shortcode_atts(
            [
                'tag' => 'wpWidgetsDefault',
                'key' => '',
                'instance' => '',
                'args' => '',
            ],
            $atts
        );

        if (!$atts['key']) {
            $atts['key'] = $widgets->defaultKey($atts['tag']);
        }
        $atts['key'] = urldecode($atts['key']);
        $instance = json_decode(rawurldecode($atts['instance']), true);
        if (is_array($instance) && isset($instance['widget-form'])) {
            $instance = $instance['widget-form'][1];
        }
        if (is_array($instance) && isset($instance['widget-rss'])) {
            $instance = $instance['widget-rss'][1];
        }
        $args = json_decode(rawurldecode($atts['args']), true);
        $output = $widgets->render($atts['key'], $args, $instance);

        return $output;
    }

    /**
     * Remove vcv_widgets shortcode for users without unfiltered_html capability.
     *
     * @param string $content
     *
     * @return string
     */
    protected function checkWidgetsShortcode($content)
    {
        if (current_user_can('unfiltered_html')) {
            return $content;
        }

        if (strpos($content, 'vcv_widgets') === false) {
            return $content;
        }

        $regex = '/' . get_shortcode_regex(['vcv_widgets']) . '/';

        while (preg_match($regex, $content)) {
            $content = preg_replace($regex, '', $content);
        }

        return $content;
    }
}
