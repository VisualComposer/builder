<?php

namespace VisualComposer\Modules\Editors\DataAjax;

use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Http\Request;
use VisualComposer\Helpers\WordPress\Actions;
use VisualComposer\Modules\System\Container;

class DataAjaxController extends Container
{
    /**
     * @var \Illuminate\Http\Request
     */
    protected $request;

    protected $event;

    /**
     * PostAjaxController constructor.
     *
     * @param \Illuminate\Contracts\Events\Dispatcher $event
     * @param \Illuminate\Http\Request $request
     */
    public function __construct(Dispatcher $event, Request $request)
    {
        $this->event = $event;
        $this->request = $request;

        Actions::add('wp_ajax_vc:v:getData', function () {
            $args = func_get_args();
            $this->call('getData', $args);
        });

        Actions::add('wp_ajax_vc:v:setData', function () {
            $args = func_get_args();
            $this->call('setData', $args);
        });
    }

    /**
     * Get post content
     */
    private function getData()
    {
        $data = '';
        $postId = $this->request->input('post_id');
        if (is_numeric($postId)) {
            // @todo: access checks
            // @todo: fix react components if there is empty page content
            $postMeta = get_post_meta($postId, 'vc_v_page_content', true);

            $data = ! empty($postMeta) ? $postMeta : get_post($postId)->post_content;
        }
        echo $data;
        die();
    }

    /**
     * Save post content and used assets
     */
    private function setData()
    {
        $data = $this->request->input('data');
        $content = $this->request->input('content');
        $postId = $this->request->input('post_id');
        if (is_numeric($postId)) {
            // @todo: save elements on page
            $post = get_post($postId);
            $post->post_content = stripslashes($content); // @todo: check for stripslashes - maybe not needed!
            wp_update_post($post);
            // In WordPress 4.4 + update_post_meta called if we use $post->meta_input = [ 'vc_v_page_content' => $data ]
            update_post_meta($postId, 'vc_v_page_content', $data);
            $this->event->fire('vc:v:postAjax:setPostData', [
                $postId,
                $post,
                $data,
            ]);
            wp_send_json_success();
        }
        die();
    }
}