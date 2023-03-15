<?php

namespace VisualComposer\Modules\Vendors\Plugins;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Backward compatibility with "Easy Table of Contents" wordPress plugin.
 *
 * @see https://wordpress.org/plugins/easy-table-of-contents
 */
class EasyTableOfContent extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    public function __construct()
    {
        $this->wpAddAction('plugins_loaded', 'initialize');
    }

    /**
     * Plugin compatibility hooks initialization.
     */
    protected function initialize()
    {
        if (! class_exists('ezTOC')) {
            return;
        }

        /** @see \VisualComposer\Modules\Vendors\Plugins\EasyTableOfContent::printLateOutputGlobalTemplateShortcodeControl */
        $this->addFilter(
            'vcv:elements:global:template:shortcode:is:print:late:output',
            'printLateOutputGlobalTemplateShortcodeControl'
        );
    }

    /**
     * Disable late output for global template shortcode.
     * In case we have Easy Table Shortcode on a page. Cos it will break our shortcode styles.
     *
     * @param bool $isPrintLateOutput
     *
     * @return bool
     */
    protected function printLateOutputGlobalTemplateShortcodeControl($isPrintLateOutput)
    {
        global $post;

        if (empty($post) || empty($post->post_content)) {
            return $isPrintLateOutput;
        }

        if (has_shortcode($post->post_content, 'ez-toc')) {
            $isPrintLateOutput = false;
        }

        return $isPrintLateOutput;
    }
}
