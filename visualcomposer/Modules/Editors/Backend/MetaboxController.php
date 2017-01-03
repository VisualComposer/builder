<?php

namespace VisualComposer\Modules\Editors\Backend;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class MetaboxController extends Container implements Module
{
    use WpFiltersActions;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Editors\Backend\MetaboxController::addMetaBox */
        $this->wpAddAction('add_meta_boxes', 'addMetaBox');
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
        echo vcview('editor/backend/content.php');
    }
}
