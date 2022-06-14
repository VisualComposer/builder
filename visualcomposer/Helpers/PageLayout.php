<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;

/**
 * Helper class for "Page Layout" setting
 *
 * From the frontend we receive a field as an array:
 * ```
 * vcv-page-template[type]
 * vcv-page-template[value]
 * vcv-page-template[stretchedContent]
 * ```
 *
 * Which further stored in a `_postmeta` table with keys:
 * ```
 * _vcv-page-template
 * _vcv-page-template-type
 * _vcv-page-template-stretch
 * ```
 */
class PageLayout implements Helper
{
    /**
     * Get a filtered current page layout
     *
     * @param array $pageTemplate Pre-defined values for page template.
     *
     * @return array
     */
    public function getCurrentPageLayout(array $pageTemplate = [])
    {
        $defaults = wp_parse_args($pageTemplate, [
            'type' => 'vc-custom-layout',
            'value' => 'default',
            'stretchedContent' => 0,
        ]);

        return vcfilter('vcv:editor:settings:pageTemplatesLayouts:current', $defaults);
    }

    /**
     * Check if current page layout equals to "Default"
     *
     * @return bool
     */
    public function isDefaultPageLayout()
    {
        $pageLayout = $this->getCurrentPageLayout();

        return isset($pageLayout['type'], $pageLayout['value'])
            && $pageLayout['type'] === 'vc-custom-layout'
            && $pageLayout['value'] === 'default';
    }
}
