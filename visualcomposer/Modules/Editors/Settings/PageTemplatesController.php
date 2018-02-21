<?php

namespace VisualComposer\Modules\Editors\Settings;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class PageTemplatesController extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    public function __construct()
    {
        if (vcvenv('VCV_PAGE_TEMPLATES_LAYOUTS')) {
            $this->addFilter('vcv:editor:variables', 'outputTemplatesLayouts');
        }
    }

    protected function outputTemplatesLayouts($variables, $payload)
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
            'key' => 'VCV_PAGE_TEMPLATES_LAYOUTS',
            'value' => [
                'current' => '',
                'all' => vcfilter(
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
            ],
            'type' => 'constant',
        ];
        $variables[] = [
            'key' => 'VCV_PAGE_TEMPLATES_LAYOUTS_THEME',
            'value' => [
                'current' => '',
                'all' => vcfilter(
                    'vcv:editor:settings:pageTemplatesLayouts:theme',
                    [
                        [
                            'type' => 'theme',
                            'title' => __('Theme Templates', 'vcwb'),
                            'values' => $pageTemplatesList,
                        ],
                    ]
                ),
            ],
            'type' => 'constant',
        ];

        return $variables;
    }
}
