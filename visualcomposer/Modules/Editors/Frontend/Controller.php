<?php

namespace VisualComposer\Modules\Editors\Frontend;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\PostType;
use VisualComposer\Helpers\Views;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Nonce;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Url;

/**
 * Class Controller.
 */
class Controller extends Container implements Module
{
    use EventsFilters;

    /**
     * Frontend constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\Editors\Frontend\Controller::renderEditorBase */
        $this->addFilter('vcv:editors:frontend:render', 'renderEditorBase');
        /** @see \VisualComposer\Modules\Editors\Frontend\Controller::init */
        $this->addEvent('vcv:inited', 'init');
    }

    /**
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\Url $urlHelper
     *
     * @return bool|void
     */
    private function init(Request $requestHelper, Url $urlHelper, PostType $postTypeHelper)
    {
        // Require an action parameter.
        if (is_admin() && $requestHelper->exists('vcv-action')) {
            $requestAction = $requestHelper->input('vcv-action');
            if ($requestAction === 'frontend') {
                $urlHelper->redirectIfUnauthorized();
                $sourceId = (int)$requestHelper->input('vcv-source-id');
                $postTypeHelper->setupPost($sourceId);
                $content = vcfilter('vcv:editors:frontend:render', '');

                return $this->terminate($content);
            }
        }

        return false;
    }

    /**
     * @param $content
     */
    private function terminate($content)
    {
        die($content);
    }

    /**
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\Views $templates
     * @param \VisualComposer\Helpers\Nonce $nonce
     *
     * @return string
     */
    private function renderEditorBase(Request $requestHelper, Views $templates, Nonce $nonce)
    {
        $sourceId = (int)$requestHelper->input('vcv-source-id');

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
}
