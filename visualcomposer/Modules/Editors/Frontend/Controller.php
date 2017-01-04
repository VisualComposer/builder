<?php

namespace VisualComposer\Modules\Editors\Frontend;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Frontend;
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
     * @param \VisualComposer\Helpers\Frontend $frontendHelper
     *
     * @return string
     */
    private function renderEditorBase(Request $requestHelper, Views $templates, Nonce $nonce, Frontend $frontendHelper)
    {
        $sourceId = (int)$requestHelper->input('vcv-source-id');

        return $templates->render(
            'editor/frontend/frontend.php',
            [
                'editableLink' => $frontendHelper->getEditableUrl($sourceId),
            ]
        );
    }
}
