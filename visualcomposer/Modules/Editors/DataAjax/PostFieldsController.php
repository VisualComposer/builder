<?php

namespace VisualComposer\Modules\Editors\DataAjax;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;

/**
 * Class PostFieldsController
 * @package VisualComposer\Modules\Editors\DataAjax
 */
class PostFieldsController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        $this->addFilter(
            'vcv:dataAjax:getData',
            'getPostFields'
        );
    }

    /**
     * @param $response
     *
     * @return mixed
     */
    protected function getPostFields($response)
    {
        $fields = [
            'attachimage' => [
                'default' => [
                    'group' => [
                        'label' => __('Default', 'vcwb'),
                        'values' => [],
                    ],
                ],
            ],
            'designOptions' => [
                'default' => [
                    'group' => [
                        'label' => __('Default', 'vcwb'),
                        'values' => [],
                    ],
                ],
            ],
            'designOptionsAdvanced' => [
                'default' => [
                    'group' => [
                        'label' => __('Default', 'vcwb'),
                        'values' => [],
                    ],
                ],
            ],
            'string' => [
                'default' => [
                    'group' => [
                        'label' => __('Default', 'vcwb'),
                        'values' => [],
                    ],
                ],
                'meta' => [
                    'group' => [
                        'label' => __('Custom Meta Field', 'vcwb'),
                        'values' => [],
                    ],
                ],
                'TEST' => [
                    'group' => [
                        'label' => __('TEST', 'vcwb'),
                        'values' => [],
                    ],
                ],
            ],
            'htmleditor' => [
                'default' => [
                    'group' => [
                        'label' => __('Default', 'vcwb'),
                        'values' => [],
                    ],
                ],
                'meta' => [
                    'group' => [
                        'label' => __('Custom Meta Field', 'vcwb'),
                        'values' => [],
                    ],
                ],
            ],
        ];
        $response['postFields'] = vcfilter(
            'vcv:editor:data:postFields',
            $fields
        );

        return $response;
    }
}
