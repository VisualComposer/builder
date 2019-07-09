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
            'vcv:dataAjax:getData vcv:ajax:getDynamicPost:adminNonce',
            'getPostFields'
        );
    }

    /**
     * @param $response
     *
     * @param $payload
     *
     * @return mixed
     */
    protected function getPostFields($response, $payload)
    {
        if (!is_array($response)) {
            $response = ['status' => true];
        }
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
            $fields,
            $payload
        );

        return $response;
    }
}
