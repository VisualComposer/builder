<?php

namespace VisualComposer\Modules\Editors\Backend;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Nonce;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Url;

class MetaboxController extends Container implements Module
{
    use WpFiltersActions;
    /**
     * @var \VisualComposer\Helpers\Request
     */
    protected $request;
    /**
     * @var \VisualComposer\Helpers\Url
     */
    protected $url;
    /**
     * @var \VisualComposer\Helpers\Nonce
     */
    protected $nonce;

    public function __construct(Request $request, Url $url, Nonce $nonce)
    {
        /** @see \VisualComposer\Modules\Editors\Backend\MetaboxController::addMetaBox */
        $this->wpAddAction('add_meta_boxes', 'addMetaBox');
        $this->request = $request;
        $this->url = $url;
        $this->nonce = $nonce;
    }

    private function addMetaBox($postType)
    {
        // TODO:
        // 0. Check part enabled post type and etc
        // 1. Check access
        // 2.
        // meta box to render
        add_meta_box(
            'vcwb_visual_composer',
            __('Visual Composer', 'vc5'),
            [
                $this,
                'render',
            ],
            $postType,
            'normal',
            'high'
        );
    }

    public function render()
    {
        $this->url->redirectIfUnauthorized();
        $sourceId = (int)$this->request->input('post');
        $this->setupPost($sourceId);

        $link = get_permalink($sourceId);
        $question = (preg_match('/\?/', $link) ? '&' : '?');
        $query = [
            'vcv-editable' => '1',
            'vcv-nonce' => $this->nonce->admin(),
        ];

        $editableLink = $link . $question . http_build_query($query);
        echo vcview('editor/backend/content.php', [
            'editableLink' => $editableLink,
        ]);
    }
    /**
     * @param $sourceId
     *
     * @return \WP_Post
     */
    public function setupPost($sourceId)
    {
        global $post_type, $post_type_object, $post;
        $post = get_post($sourceId);
        setup_postdata($post);
        $post_type = $post->post_type;
        $post_type_object = get_post_type_object($post_type);

        return $post;
    }
}
