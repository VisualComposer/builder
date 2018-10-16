<?php

namespace VisualComposer\Modules\FrontView;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class PluginsInfoController extends Container implements Module
{
    use WpFiltersActions;

    public function __construct()
    {
        $this->wpAddAction('wp_head', 'addMetaGenerator');
        $this->wpAddFilter('body_class', 'addBodyClass');
    }

    protected function addMetaGenerator()
    {
        if (apply_filters('vcv:api:output:meta', apply_filters('vcv:output:meta', true))) {
            $text = __(
                'Powered by Visual Composer Website Builder - fast and easy to use drag and drop builder for experts and beginners.',
                'vcwb'
            );
            echo sprintf(
                '<meta name="generator" content="%s"/>',
                esc_attr($text)
            );
        }
    }

    protected function addBodyClass($classes)
    {
        $classes[] = 'vcwb';

        return $classes;
    }
}
