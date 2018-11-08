<?php

namespace VisualComposer\Modules\Editors\FrontendLayoutSwitcher;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Access\EditorPostType;
use VisualComposer\Helpers\Assets;
use VisualComposer\Helpers\Frontend;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Url;

class BundleController extends Container implements Module
{
    use WpFiltersActions;

    public function __construct()
    {
        $this->wpAddAction('edit_form_top', 'addCurrentEditorField');
        $this->wpAddAction('admin_enqueue_scripts', 'addBundleStyle');
        $this->wpAddAction('admin_enqueue_scripts', 'addBundleScript');
    }

    protected function addCurrentEditorField($post, EditorPostType $editorPostTypeHelper)
    {
        // @codingStandardsIgnoreLine
        if ($editorPostTypeHelper->isEditorEnabled($post->post_type)) {
            $beEditor = get_post_meta(get_the_ID(), VCV_PREFIX . 'be-editor', true);
            if ($beEditor !== 'classic') {
                $beEditor = 'be';
            }
            echo '<input type="hidden" name="vcv-be-editor" id="vcv-be-editor" value="' . esc_attr($beEditor) . '">';
        }
    }

    protected function addBundleStyle(
        Url $urlHelper,
        Frontend $frontendHelper,
        EditorPostType $editorPostTypeHelper
    ) {
        $screen = get_current_screen();
        // @codingStandardsIgnoreLine
        if ($screen->post_type === get_post_type() && $editorPostTypeHelper->isEditorEnabled(get_post_type())
            && !$frontendHelper->isFrontend()) {
            // Add CSS
            wp_enqueue_style(
                'vcv:editors:backendswitcher:style',
                $urlHelper->to('public/dist/wpbackendswitch.bundle.css'),
                [],
                VCV_VERSION
            );
        }
    }

    protected function addBundleScript(
        Url $urlHelper,
        Frontend $frontendHelper,
        EditorPostType $editorPostTypeHelper
    ) {
        $screen = get_current_screen();
        // @codingStandardsIgnoreLine
        if ($screen->post_type === get_post_type() && $editorPostTypeHelper->isEditorEnabled(get_post_type())
            && !$frontendHelper->isFrontend()) {
            wp_enqueue_script(
                'vcv:editors:backendswitcher:script',
                $urlHelper->to('public/dist/wpbackendswitch.bundle.js'),
                ['vcv:assets:vendor:script'],
                VCV_VERSION
            );

            // Add JS
            $scriptBody = sprintf('window.vcvFrontendEditorLink = "%s";', $frontendHelper->getFrontendUrl());
            wp_add_inline_script('vcv:editors:backendswitcher:script', $scriptBody, 'before');
        }
    }
}
