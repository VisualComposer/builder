<?php

namespace VisualComposer\Modules\Editors\Backend;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Access\EditorPostType;
use VisualComposer\Helpers\Traits\WpFiltersActions;
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

    public function __construct(Request $request, Url $url)
    {
        if (vcvenv('VCV_TF_DISABLE_BE')) {
            return;
        }
        $this->request = $request;
        $this->url = $url;

        /** \VisualComposer\Modules\Editors\Backend\MetaboxController::addMetaBox */
        $this->wpAddAction('add_meta_boxes', 'addMetaBox');
    }

    public function render()
    {
        global $post;
        $this->url->redirectIfUnauthorized();
        $sourceId = $post->ID;
        vchelper('PostType')->setupPost($sourceId);
        $frontendHelper = vchelper('Frontend');
        $content = vcfilter(
            'vcv:editors:backend:render',
            vcview(
                'editor/backend/content.php',
                [
                    'editableLink' => $frontendHelper->getEditableUrl($sourceId),
                    'frontendEditorLink' => $frontendHelper->getFrontendUrl($sourceId),
                ]
            )
        );

        // @codingStandardsIgnoreLine
        echo $content;
    }

    protected function addMetaBox($postType, EditorPostType $editorPostTypeHelper)
    {
        if ($editorPostTypeHelper->isEditorEnabled($postType)
            && vcfilter(
                'vcv:editors:backend:addMetabox',
                true,
                ['postType' => $postType]
            )
        ) {
            add_meta_box(
                'vcwb_visual_composer',
                __('Visual Composer Website Builder', 'vcwb'),
                [
                    $this,
                    'render',
                ],
                $postType,
                'normal',
                'high'
            );
        }
    }
}
