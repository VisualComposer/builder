<?php

namespace VisualComposer\Modules\Editors\DataAjax;

use VisualComposer\Helpers\Filters as FilterDispatcher;
//use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Framework\Container;

/**
 * Class Controller.
 */
class Controller extends Container /* implements Module */
{
    /**
     * @var \VisualComposer\Helpers\Request
     */
    protected $request;

    /**
     * @var \VisualComposer\Helpers\Filters
     */
    protected $filter;

    /**
     * Controller constructor.
     *
     * @param \VisualComposer\Helpers\Filters $filterHelper
     * @param \VisualComposer\Helpers\Request $requestHelper
     */
    public function __construct(FilterDispatcher $filterHelper, Request $requestHelper)
    {
        $this->filter = $filterHelper;
        $this->request = $requestHelper;

        $filterHelper->listen(
            'vcv:ajax:getData:adminNonce',
            function () {
                /** @see \VisualComposer\Modules\Editors\DataAjax\Controller::getData */
                return $this->call('getData');
            }
        );

        $filterHelper->listen(
            'vcv:ajax:setData:adminNonce',
            function () {
                /** @see \VisualComposer\Modules\Editors\DataAjax\Controller::setData */
                return $this->call('setData');
            }
        );
    }

    /**
     * Get post content.
     */
    private function getData()
    {
        $data = '';
        $sourceId = $this->request->input('vcv-source-id');
        if (is_numeric($sourceId)) {
            // TODO: fix react components if there is empty page content.
            $postMeta = get_post_meta($sourceId, VCV_PREFIX . 'pageContent', true);
            $data = !empty($postMeta) ? $postMeta : get_post($sourceId)->post_content;
        }

        return $data;
    }

    /**
     * Save post content and used assets.
     */
    private function setData()
    {
        $data = $this->request->input('vcv-data');
        $content = $this->request->input('vcv-content');
        $sourceId = $this->request->input('vcv-source-id');
        if (is_numeric($sourceId)) {
            // TODO: Save elements on page.
            $post = get_post($sourceId);
            $post->post_content = stripslashes($content); // TODO: check for stripslashes - maybe not needed!
            wp_update_post($post);
            // In WordPress 4.4 + update_post_meta called if we use $post->meta_input = [ 'vcv:pageContent' => $data ]
            update_post_meta($sourceId, VCV_PREFIX . 'pageContent', $data);
            $response = $this->filter->fire(
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

        return [
            'success' => false,
        ];
    }
}
