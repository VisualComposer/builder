<?php

namespace VisualComposer\Modules\Editors\DataAjax;

use VisualComposer\Framework\Illuminate\Contracts\Events\Dispatcher;
use VisualComposer\Helpers\Generic\Request;
use VisualComposer\Framework\Container;

class Controller extends Container
{
    protected $request;
    protected $event;

    public function __construct(Dispatcher $event, Request $request)
    {
        $this->event = $event;
        $this->request = $request;

        add_action(
            'vc:v:ajax:loader:v:getData:adminNonce',
            function () {
                $this->call('getData');
            }
        );

        add_action(
            'vc:v:ajax:loader:setData:adminNonce',
            function () {
                $this->call('setData');
            }
        );
    }

    /**
     * Get post content
     */
    private function getData()
    {
        $data = '';
        $sourceId = $this->request->input('source_id');
        if (is_numeric($sourceId)) {
            // @todo: access checks
            // @todo: fix react components if there is empty page content
            $postMeta = get_post_meta($sourceId, VC_V_PREFIX . 'page_content', true);

            $data = !empty($postMeta) ? $postMeta : get_post($sourceId)->post_content;
        }
        echo $data;
    }

    /**
     * Save post content and used assets
     */
    private function setData()
    {
        $data = $this->request->input('data');
        $content = $this->request->input('content');
        $sourceId = $this->request->input('source_id');
        if (is_numeric($sourceId)) {
            // @todo: save elements on page
            $post = get_post($sourceId);
            $post->post_content = stripslashes($content); // @todo: check for stripslashes - maybe not needed!
            wp_update_post($post);
            // In WordPress 4.4 + update_post_meta called if we use $post->meta_input = [ 'vc_v_page_content' => $data ]
            update_post_meta($sourceId, VC_V_PREFIX . 'page_content', $data);
            $this->event->fire(
                'vc:v:postAjax:setPostData',
                [
                    $sourceId,
                    $post,
                    $data,
                ]
            );
        }
    }
}
