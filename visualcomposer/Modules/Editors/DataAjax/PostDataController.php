<?php

namespace VisualComposer\Modules\Editors\DataAjax;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\PostData;
use VisualComposer\Helpers\Traits\EventsFilters;

/**
 * Class PostDataController
 * @package VisualComposer\Modules\Editors\DataAjax
 */
class PostDataController extends Container implements Module
{
    use EventsFilters;

    /**
     * Use for dynamic fields components
     * PostDataController constructor.
     */
    public function __construct()
    {
        $this->addFilter(
            'vcv:dataAjax:getData vcv:ajax:getDynamicPost:adminNonce',
            'getPostData'
        );
    }

    /**
     * @param $response
     * @param $payload
     *
     * @param \VisualComposer\Helpers\PostData $postDataHelper
     *
     * @return mixed
     */
    protected function getPostData($response, $payload, PostData $postDataHelper)
    {
        if (!is_array($response)) {
            $response = ['status' => true];
        }

        $post = get_post($payload['sourceId']);
        // @codingStandardsIgnoreLine
        if (!isset($post) || $post->post_status === 'trash') {
            $response['postData'] = [];
            $response['postFields']['htmleditor'] = [];

            return $response;
        }

        $response['postData'] = vcfilter(
            'vcv:editor:data:postData',
            $postDataHelper->getDefaultPostData($payload['sourceId']),
            $payload
        );

        return $response;
    }
}
