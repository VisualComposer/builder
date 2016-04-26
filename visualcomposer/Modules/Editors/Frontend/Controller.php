<?php

namespace VisualComposer\Modules\Editors\Frontend;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Templates;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Nonce;
use VisualComposer\Framework\Container;

/**
 * Class Controller
 */
class Controller extends Container implements Module
{
    /**
     * Frontend constructor
     */
    public function __construct()
    {
        add_action(
            'vcv:ajax:loader:frontend',
            function () {
                // @todo check access
                /** @see \VisualComposer\Modules\Editors\Frontend\Frontend::renderEditorBase */
                $this->call('renderEditorBase');
            }
        );
    }

    /**
     * @param \VisualComposer\Helpers\Request $request
     * @param \VisualComposer\Helpers\Templates $templates
     * @param \VisualComposer\Helpers\Nonce $nonce
     */
    public function renderEditorBase(Request $request, Templates $templates, Nonce $nonce)
    {
        global $post;
        $sourceId = (int)$request->input('vcv-source-id');

        $post = get_post($sourceId);
        setup_postdata($post);

        $link = get_permalink($sourceId);
        $question = (preg_match('/\?/', $link) ? '&' : '?');
        $query = [
            'vcv-editable' => '1',
            'vcv-nonce' => $nonce->admin(),
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
