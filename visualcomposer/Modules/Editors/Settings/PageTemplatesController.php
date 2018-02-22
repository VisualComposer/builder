<?php

namespace VisualComposer\Modules\Editors\Settings;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
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
                'viewPageTemplate'
            );
        }
    }

    protected function getCurrentTemplateLayout($output, PostType $postTypeHelper)
    {
        $post = $postTypeHelper->get();
        if ($post) {
            // @codingStandardsIgnoreLine
            $currentPostTemplate = $post->page_template;
            $customTemplate = get_post_meta($post->ID, '_vcv-page-template', true);
            $customTemplateType = get_post_meta($post->ID, '_vcv-page-template-type', true);
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
        if (!empty($current) && $current['type'] !== 'theme') {
            return vcfilter('vcv:editor:settings:viewPageTemplate', $current['value'], $current);
        }

        return $originalTemplate;
    }
}
