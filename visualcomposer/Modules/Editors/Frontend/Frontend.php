<?php
namespace VisualComposer\Modules\Editors\Frontend;

use VisualComposer\Helpers\Generic\Templates;
use VisualComposer\Helpers\Generic\Request;
use VisualComposer\Helpers\WordPress\Nonce;
use VisualComposer\Framework\Container;

/**
 * Class Frontend
 * @package VisualComposer\Modules\Editors\Frontend
 */
class Frontend extends Container
{
    /**
     * Frontend constructor.
     */
    public function __construct()
    {
        add_action(
            'vc:v:ajax:loader:frontend',
            function () {
                // @todo check access
                /** @see \VisualComposer\Modules\Editors\Frontend\Frontend::renderEditorBase */
                $this->call('renderEditorBase');
            }
        );
    }

    /**
     * @param \VisualComposer\Helpers\Generic\Request $request
     * @param \VisualComposer\Helpers\Generic\Templates $templates
     * @param \VisualComposer\Helpers\WordPress\Nonce $nonce
     */
    private function renderEditorBase(Request $request, Templates $templates, Nonce $nonce)
    {
        global $post;
        $sourceId = (int)$request->input('vc-source-id');

        $post = get_post($sourceId);
        setup_postdata($post);

        $link = get_permalink($sourceId);
        $question = (preg_match('/\?/', $link) ? '&' : '?');
        $query = [
            'vc-v-editable' => '1',
            'nonce' => $nonce->admin(),
        ];

        $editableLink = $link . $question . http_build_query($query);
        $templates->render(
            'editor/frontend/frontend',
            [
                'editableLink' => $editableLink,
            ]
        );
    }
}
