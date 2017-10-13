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
use VisualComposer\Modules\Elements\Traits\AddShortcodeTrait;

class WpSidebarShortcode extends Container implements Module
{
    use EventsFilters;
    use AddShortcodeTrait;

    public function __construct()
    {
        $this->addEvent('vcv:inited', 'registerShortcode');
    }

    /**
     *
     */
    protected function registerShortcode()
    {
        $this->addShortcode('vcv_sidebar', 'render');
    }

    /**
     * @param $atts
     * @param $content
     * @param $tag
     *
     * @return string
     */
    protected function render($atts, $content, $tag)
    {
        $atts = shortcode_atts(
            [
                'key' => '',
            ],
            $atts
        );
        ob_start();
        dynamic_sidebar($atts['key']);
        $output = ob_get_clean();

        return $output;
    }
}
