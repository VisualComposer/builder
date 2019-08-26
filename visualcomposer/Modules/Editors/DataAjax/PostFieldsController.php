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

        $post = get_post($payload['sourceId']);
        $postType = get_post_type($post);
        if (in_array($postType, ['vcv_headers', 'vcv_footers', 'vcv_sidebars', 'vcv_templates'])) {
            $payload['forceAddField'] = true;
        }

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
                        'label' => __('Post', 'vcwb'),
                        'values' => [],
                    ],
                ],
                'site' => [
                    'group' => [
                        'label' => __('Site', 'vcwb'),
                        'values' => [],
                    ],
                ],
                'author' => [
                    'group' => [
                        'label' => __('Author', 'vcwb'),
                        'values' => [],
                    ],
                ],
            ],
            'designOptions' => [
                'post' => [
                    'group' => [
                        'label' => __('Post', 'vcwb'),
                        'values' => [],
                    ],
                ],
                'site' => [
                    'group' => [
                        'label' => __('Site', 'vcwb'),
                        'values' => [],
                    ],
                ],
                'author' => [
                    'group' => [
                        'label' => __('Author', 'vcwb'),
                        'values' => [],
                    ],
                ],
            ],
            'designOptionsAdvanced' => [
                'post' => [
                    'group' => [
                        'label' => __('Post', 'vcwb'),
                        'values' => [],
                    ],
                ],
                'site' => [
                    'group' => [
                        'label' => __('Site', 'vcwb'),
                        'values' => [],
                    ],
                ],
                'author' => [
                    'group' => [
                        'label' => __('Author', 'vcwb'),
                        'values' => [],
                    ],
                ],
            ],
            'string' => [
                'post' => [
                    'group' => [
                        'label' => __('Post', 'vcwb'),
                        'values' => [],
                    ],
                ],
                'site' => [
                    'group' => [
                        'label' => __('Site', 'vcwb'),
                        'values' => [],
                    ],
                ],
                'author' => [
                    'group' => [
                        'label' => __('Author', 'vcwb'),
                        'values' => [],
                    ],
                ],
                'meta' => [
                    'group' => [
                        'label' => __('Custom Fields', 'vcwb'),
                        'values' => [],
                    ],
                ],
            ],
            'htmleditor' => [
                'post' => [
                    'group' => [
                        'label' => __('Post', 'vcwb'),
                        'values' => [],
                    ],
                ],
                'site' => [
                    'group' => [
                        'label' => __('Site', 'vcwb'),
                        'values' => [],
                    ],
                ],
                'author' => [
                    'group' => [
                        'label' => __('Author', 'vcwb'),
                        'values' => [],
                    ],
                ],
                'meta' => [
                    'group' => [
                        'label' => __('Custom Fields', 'vcwb'),
                        'values' => [],
                    ],
                ],
            ],
            'inputSelect' => [
                'post' => [
                    'group' => [
                        'label' => __('Post', 'vcwb'),
                        'values' => [],
                    ],
                ],
                'site' => [
                    'group' => [
                        'label' => __('Site', 'vcwb'),
                        'values' => [],
                    ],
                ],
                'author' => [
                    'group' => [
                        'label' => __('Author', 'vcwb'),
                        'values' => [],
                    ],
                ],
                'meta' => [
                    'group' => [
                        'label' => __('Custom Fields', 'vcwb'),
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
