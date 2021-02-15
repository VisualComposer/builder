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
        $this->addFilter('vcv:frontend:content:encode', 'runNativeContentFilters');

        $requestHelper = vchelper('Request');
        if (
            ($requestHelper->exists('page') && strpos($requestHelper->input('page'), 'vcv') !== false) ||
            ($requestHelper->exists('post_type') && strpos($requestHelper->input('post_type'), 'vcv') !== false)
        ) {
            add_filter('admin_footer_text', [$this, 'adminFooterText'], 100000, 1);
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

    protected function runNativeContentFilters($content)
    {
        if (function_exists('wptexturize') && has_filter('the_content', 'wptexturize')) {
            $content = wptexturize($content);
        }

        if (function_exists('prepend_attachment') && has_filter('the_content', 'prepend_attachment')) {
            $content = prepend_attachment($content);
        }
        if (function_exists('wp_filter_content_tags') && has_filter('the_content', 'wp_filter_content_tags')) {
            $content = wp_filter_content_tags($content);
        }
        if (function_exists('convert_smilies') && has_filter('the_content', 'convert_smilies')) {
            $content = convert_smilies($content);
        }

        return $content;
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
