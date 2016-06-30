<?php

namespace VisualComposer\Modules\Editors\Frontend;

use VisualComposer\Helpers\Filters;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Templates;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Nonce;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Url;

/**
 * Class Controller.
 */
class Controller extends Container implements Module
{
    /**
     * Frontend constructor.
     *
     * @param \VisualComposer\Helpers\Filters $filterHelper
     */
    public function __construct(Filters $filterHelper)
    {
        $filterHelper->listen(
            'vcv:ajax:frontend',
            function () {
                /** @see \VisualComposer\Modules\Editors\Frontend\Controller::renderEditorBase */
                return $this->call('renderEditorBase');
            }
        );
    }

    /**
     * @param \VisualComposer\Helpers\Request $request
     * @param \VisualComposer\Helpers\Templates $templates
     * @param \VisualComposer\Helpers\Nonce $nonce
     *
     * @return string
     */
    private function renderEditorBase(Request $request, Templates $templates, Nonce $nonce)
    {
        $sourceId = (int)$request->input('vcv-source-id');
        $this->setupPost($sourceId);

        $link = get_permalink($sourceId);
        $question = (preg_match('/\?/', $link) ? '&' : '?');
        $query = [
            'vcv-editable' => '1',
            'vcv-nonce' => $nonce->admin(),
        ];

        $editableLink = $link . $question . http_build_query($query);

        return $templates->render(
            'editor/frontend/frontend.php',
            [
                'editableLink' => $editableLink,
            ]
        );
    }

    /**
     * @param $sourceId
     *
     * @return \WP_Post
     */
    private function setupPost($sourceId)
    {
        global $post;
        $post = get_post($sourceId);
        setup_postdata($post);

        return $post;
    }

    public function getFrontendUrl($postId, Url $urlHelper)
    {
        $url = $urlHelper->ajax(
            [
                'vcv-action' => 'frontend',
                'vcv-source-id' => $postId,
            ]
        );

        return $url;
    }
}
