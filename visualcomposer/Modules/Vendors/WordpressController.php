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

        $requestHelper = vchelper('Request');
        if (
            ($requestHelper->exists('page') && strpos($requestHelper->input('page'), 'vcv') !== false) ||
            ($requestHelper->exists('post_type') && strpos($requestHelper->input('post_type'), 'vcv') !== false)
        ) {
            add_filter('admin_footer_text', array($this, 'adminFooterText'), 100000, 1);
        }
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

    public function adminFooterText($current)
    {
        return sprintf(
            __(
                'Thank you for choosing Visual Composer Website Builder. <br>' .
                'Like the plugin? %sRate us on WordPress.org%s',
                'visualcomposer'
            ),
            '<a href="https://wordpress.org/support/plugin/visualcomposer/reviews/?filter=5" target="_blank" rel="noopener noreferrer">',
            '</a>'
        );
    }
}
