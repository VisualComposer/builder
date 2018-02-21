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
            $this->addFilter('vcv:editor:variables', 'outputCurrentTemplatesLayouts');
            $this->addFilter('vcv:editor:variables', 'outputTemplatesLayouts');
            $this->addFilter('vcv:editor:variables', 'outputThemeTemplates');
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

    protected function outputCurrentTemplatesLayouts($variables, $payload)
    {
        $variables[] = [
            'key' => 'VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT',
            'value' => vcfilter(
                'vcv:editor:settings:pageTemplatesLayouts:current',
                [
                    'type' => 'theme',
                    'value' => 'default',
                ]
            ),
            'type' => 'constant',
        ];

        return $variables;
    }

    protected function outputTemplatesLayouts($variables, $payload)
    {
        $variables[] = [
            'key' => 'VCV_PAGE_TEMPLATES_LAYOUTS',
            'value' => vcfilter(
                'vcv:editor:settings:pageTemplatesLayouts',
                [
                    [
                        'type' => 'vc',
                        'title' => __('Visual Composer', 'vcwb'),
                        'values' => [
                            [
                                'label' => __('Blank Template', 'vcwb'),
                                'value' => 'blank',
                            ],
                            [
                                'label' => __('Boxed Template', 'vcwb'),
                                'value' => 'boxed',
                            ],
                        ],
                    ],
                ]
            ),
            'type' => 'constant',
        ];

        return $variables;
    }

    protected function outputThemeTemplates($variables, $payload)
    {
        $pageTemplates = get_page_templates();
        $pageTemplatesList = [
            [
                'label' => __('Default', 'vcwb'),
                'value' => 'default',
            ],
        ];
        if (!empty($pageTemplates)) {
            foreach ($pageTemplates as $key => $template) {
                $pageTemplatesList[] = [
                    'label' => $key,
                    'value' => $template,
                ];
            }
        }

        $variables[] = [
            'key' => 'VCV_PAGE_TEMPLATES_LAYOUTS_THEME',
            'value' => vcfilter(
                'vcv:editor:settings:pageTemplatesLayouts:theme',
                [
                    [
                        'type' => 'theme',
                        'title' => __('Theme Templates', 'vcwb'),
                        'values' => $pageTemplatesList,
                    ],
                ]
            ),
            'type' => 'constant',
        ];

        return $variables;
    }
}
