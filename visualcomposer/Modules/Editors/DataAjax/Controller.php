<?php

namespace VisualComposer\Modules\Editors\DataAjax;

use VisualComposer\Helpers\Filters as FilterDispatcher;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Traits\EventsFilters;

/**
 * Class Controller.
 */
class Controller extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Editors\DataAjax\Controller::getData */
        $this->addFilter(
            'vcv:ajax:getData:adminNonce',
            'getData'
        );

        /** @see \VisualComposer\Modules\Editors\DataAjax\Controller::setData */
        $this->addFilter(
            'vcv:ajax:setData:adminNonce',
            'setData'
        );
    }

    /**
     * Get post content.
     *
     * @param \VisualComposer\Helpers\Request $requestHelper
     *
     * @return mixed|string
     */
    private function getData(Request $requestHelper)
    {
        $data = '';
        $sourceId = $requestHelper->input('vcv-source-id');
        if (is_numeric($sourceId)) {
            // TODO: fix react components if there is empty page content.
            $postMeta = get_post_meta($sourceId, VCV_PREFIX . 'pageContent', true);
            $data = $postMeta; /* !empty($postMeta) ? $postMeta : get_post($sourceId)->post_content; */
        }

        return $data;
    }

    /**
     * Save post content and used assets.
     *
     * @param \VisualComposer\Helpers\Filters $filterHelper
     * @param \VisualComposer\Helpers\Request $requestHelper
     *
     * @return array|null
     */
    private function setData(FilterDispatcher $filterHelper, Request $requestHelper)
    {
        $data = json_decode(rawurldecode($requestHelper->input('vcv-data')));
        $content = $requestHelper->input('vcv-content');
        $sourceId = $requestHelper->input('vcv-source-id');
        if (is_numeric($sourceId)) {
            // TODO: Save elements on page.
            $post = get_post($sourceId);
            if ($post) {
                $post->post_content = $content;
                wp_update_post($post);
                // In WordPress 4.4 + update_post_meta called if we use $post->meta_input = [ 'vcv:pageContent' => $data ]
                update_post_meta($sourceId, VCV_PREFIX . 'pageContent', $data);
                $response = $filterHelper->fire(
                    'vcv:postAjax:setPostData',
                    [
                        'success' => true,
                    ],
                    [
                        'sourceId' => $sourceId,
                        'post' => $post,
                        'data' => $data,
                    ]
                );

                return $response;
            }
        }

        return [
            'success' => false,
        ];
    }
}
