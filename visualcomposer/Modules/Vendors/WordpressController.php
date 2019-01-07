<?php

namespace VisualComposer\Modules\Vendors;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;

class WordpressController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        $this->addFilter('vcv:frontend:content:encode', 'fixWpEmbedShortcode');
    }

    protected function fixWpEmbedShortcode($content)
    {
        // @codingStandardsIgnoreStart
        global $wp_embed;
        $embedContent = $wp_embed->run_shortcode($content);
        $embedContent = $wp_embed->autoembed($embedContent);

        // @codingStandardsIgnoreEnd

        return $embedContent;
    }
}
