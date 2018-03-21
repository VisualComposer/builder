<?php

namespace VisualComposer\Modules\Editors\Settings;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Frontend;
use VisualComposer\Helpers\PostType;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class PageTemplatesController extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    public function __construct()
    {
        if (vcvenv('VCV_PAGE_TEMPLATES_LAYOUTS')) {
            $this->addFilter('vcv:editor:settings:pageTemplatesLayouts:current', 'getCurrentTemplateLayout');

            $this->wpAddFilter(
                'template_include',
                'viewPageTemplate',
                8
            );
        }
    }

    protected function getCurrentTemplateLayout($output, PostType $postTypeHelper, Frontend $frontendHelper)
    {
        //always return default template for search and archive page
        if (is_search() || is_archive()) {
            return $output;
        }

        $post = $postTypeHelper->get();
        if ($post) {
            if ($frontendHelper->isPreview()) {
                $preview = wp_get_post_autosave($post->ID);
                if (is_object($preview)) {
                    $post = $preview;
                }
            }
            // @codingStandardsIgnoreLine
            $currentPostTemplate = $post->page_template;
            $customTemplate = get_post_meta($post->ID, '_vcv-page-template', true);
            $customTemplateType = get_post_meta($post->ID, '_vcv-page-template-type', true);
            // BC: For TemplateFilterController.php
            if (in_array($currentPostTemplate, ['boxed-blank-template.php', 'blank-template.php'])) {
                $customTemplateType = 'vc';
                $currentPostTemplate = str_replace('-template.php', '', $currentPostTemplate);
                $customTemplate = str_replace('boxed-blank', 'boxed', $currentPostTemplate);
            }

            if (!empty($customTemplateType) && !empty($customTemplate)) {
                $output = [
                    'type' => $customTemplateType,
                    'value' => $customTemplate,
                ];
            } else {
                $output = [
                    'type' => 'theme',
                    'value' => !empty($currentPostTemplate) ? $currentPostTemplate : 'default',
                ];
            }
        }

        return $output;
    }

    protected function viewPageTemplate($originalTemplate)
    {
        /** @see \VisualComposer\Modules\Editors\Settings\PageTemplatesController::getCurrentTemplateLayout */
        $current = $this->call(
            'getCurrentTemplateLayout',
            [
                'output' => [
                    'type' => 'theme',
                    'value' => $originalTemplate,
                ],
            ]
        );
        if (!empty($current)) {
            $result = $originalTemplate;
            if ($current['type'] !== 'theme') {
                $result = vcfilter('vcv:editor:settings:viewPageTemplate', $current['value'], $current);
            } elseif ($current['value'] && $current['value'] !== 'default') {
                $result = locate_template($current['value']);
                if (empty($result)) {
                    $result = $originalTemplate;
                }
            }

            return $result;
        }

        return $originalTemplate;
    }
}
