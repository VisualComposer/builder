<?php

namespace VisualComposer\Modules\Editors\DataAjax;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
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
     * @param \VisualComposer\Helpers\Request $requestHelper
     *
     * @return mixed
     */
    protected function getPostFields($response, $payload, Request $requestHelper)
    {
        if (isset($response['forceAddField'])) {
            $payload = array_merge($payload, ['forceAddField' => $response['forceAddField']]);
        }

        if (!is_array($response)) {
            $response = ['status' => true];
        }

        $post = get_post($payload['sourceId']);

        // @codingStandardsIgnoreLine
        if (!isset($post) || $post->post_status === 'trash') {
            $response['postFields'] = [];
            $response['postFields']['htmleditor'] = [];

            return $response;
        }

        $fields = [
            'attachimage' => [
                'post' => [
                    'group' => [
                        'label' => __('Post', 'visualcomposer'),
                        'values' => [],
                    ],
                ],
                'site' => [
                    'group' => [
                        'label' => __('Site', 'visualcomposer'),
                        'values' => [],
                    ],
                ],
                'author' => [
                    'group' => [
                        'label' => __('Author', 'visualcomposer'),
                        'values' => [],
                    ],
                ],
            ],
            'designOptions' => [
                'post' => [
                    'group' => [
                        'label' => __('Post', 'visualcomposer'),
                        'values' => [],
                    ],
                ],
                'site' => [
                    'group' => [
                        'label' => __('Site', 'visualcomposer'),
                        'values' => [],
                    ],
                ],
                'author' => [
                    'group' => [
                        'label' => __('Author', 'visualcomposer'),
                        'values' => [],
                    ],
                ],
            ],
            'designOptionsAdvanced' => [
                'post' => [
                    'group' => [
                        'label' => __('Post', 'visualcomposer'),
                        'values' => [],
                    ],
                ],
                'site' => [
                    'group' => [
                        'label' => __('Site', 'visualcomposer'),
                        'values' => [],
                    ],
                ],
                'author' => [
                    'group' => [
                        'label' => __('Author', 'visualcomposer'),
                        'values' => [],
                    ],
                ],
            ],
            'string' => [
                'post' => [
                    'group' => [
                        'label' => __('Post', 'visualcomposer'),
                        'values' => [],
                    ],
                ],
                'site' => [
                    'group' => [
                        'label' => __('Site', 'visualcomposer'),
                        'values' => [],
                    ],
                ],
                'author' => [
                    'group' => [
                        'label' => __('Author', 'visualcomposer'),
                        'values' => [],
                    ],
                ],
                'meta' => [
                    'group' => [
                        'label' => __('Custom Fields', 'visualcomposer'),
                        'values' => [],
                    ],
                ],
            ],
            'htmleditor' => [
                'post' => [
                    'group' => [
                        'label' => __('Post', 'visualcomposer'),
                        'values' => [],
                    ],
                ],
                'site' => [
                    'group' => [
                        'label' => __('Site', 'visualcomposer'),
                        'values' => [],
                    ],
                ],
                'author' => [
                    'group' => [
                        'label' => __('Author', 'visualcomposer'),
                        'values' => [],
                    ],
                ],
                'meta' => [
                    'group' => [
                        'label' => __('Custom Fields', 'visualcomposer'),
                        'values' => [],
                    ],
                ],
            ],
            'inputSelect' => [
                'post' => [
                    'group' => [
                        'label' => __('Post', 'visualcomposer'),
                        'values' => [],
                    ],
                ],
                'site' => [
                    'group' => [
                        'label' => __('Site', 'visualcomposer'),
                        'values' => [],
                    ],
                ],
                'author' => [
                    'group' => [
                        'label' => __('Author', 'visualcomposer'),
                        'values' => [],
                    ],
                ],
                'meta' => [
                    'group' => [
                        'label' => __('Custom Fields', 'visualcomposer'),
                        'values' => [],
                    ],
                ],
            ],
            'url' => [
                'post' => [
                    'group' => [
                        'label' => __('Post', 'visualcomposer'),
                        'values' => [],
                    ],
                ],
                'site' => [
                    'group' => [
                        'label' => __('Site', 'visualcomposer'),
                        'values' => [],
                    ],
                ],
                'meta' => [
                    'group' => [
                        'label' => __('Custom Fields', 'visualcomposer'),
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
