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

class PageTemplatesVariablesController extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    public function __construct()
    {
        $this->addFilter('vcv:editor:variables', 'outputCurrentTemplatesLayouts');
        $this->addFilter('vcv:editor:variables', 'outputTemplatesLayouts');
        $this->addFilter('vcv:editor:variables', 'outputThemeTemplates');
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
        if (vcvenv('VCV_TF_BLANK_PAGE_BOXED')) {
            $value = [
                [
                    'label' => __('Blank Template', 'vcwb'),
                    'value' => 'blank',
                ],
            ];
        } else {
            $value = [
                [
                    'label' => __('Boxed Template', 'vcwb'),
                    'value' => 'boxed',
                ],
                [
                    'label' => __('Blank Template', 'vcwb'),
                    'value' => 'blank',
                ],
            ];
        }

        $variables[] = [
            'key' => 'VCV_PAGE_TEMPLATES_LAYOUTS',
            'value' => vcfilter(
                'vcv:editor:settings:pageTemplatesLayouts',
                [
                    [
                        'type' => 'vc',
                        'title' => __('Visual Composer', 'vcwb'),
                        'values' => $value,
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
