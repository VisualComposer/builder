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
use VisualComposer\Helpers\Frontend;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Url;

class BundleController extends Container implements Module
{
    use WpFiltersActions;

    public function __construct()
    {
        $this->wpAddAction('edit_form_top', 'addCurrentEditorField');
        $this->wpAddAction('edit_form_advanced', 'addCurrentEditorField');
        $this->wpAddAction('admin_enqueue_scripts', 'addBundleStyle');
        $this->wpAddAction('admin_enqueue_scripts', 'addBundleScript');
    }

    protected function addCurrentEditorField(
        $post,
        EditorPostType $editorPostTypeHelper,
        Options $optionsHelper,
        Request $requestHelper
    ) {
        // @codingStandardsIgnoreLine
        if ($editorPostTypeHelper->isEditorEnabled($post->post_type)) {
            $savedEditor = get_post_meta(get_the_ID(), VCV_PREFIX . 'be-editor', true);
            $defaultEditor = $optionsHelper->get('settings', ['gutenberg-editor']);
            $currentEditor = false;
            if ((!empty($defaultEditor) && in_array('gutenberg-editor', $defaultEditor))
                && $requestHelper->input(
                    'vcv-set-editor'
                ) === 'gutenberg') {
                $currentEditor = 'gutenberg';
            }

            if (!$currentEditor && !$savedEditor) {
                $editor = 'gutenberg';
            } elseif (!$currentEditor) {
                $editor = $savedEditor;
            } else {
                $editor = $currentEditor;
            }
            echo '<input type="hidden" name="vcv-be-editor" id="vcv-be-editor" value="' . esc_attr($editor) . '">';
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
        EditorPostType $editorPostTypeHelper,
        Request $requestHelper
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
            // Disable TinyMCE to avoid markup break, empty tags removal and etc VC-516
            $savedEditor = get_post_meta(get_the_ID(), VCV_PREFIX . 'be-editor', true);
            if ($savedEditor !== 'classic' && !$requestHelper->exists('classic-editor')
                && !(method_exists($screen, 'is_block_editor')
                    && $screen->is_block_editor())) {
                // Not Block editor, apply only in classic-mode
                add_filter('user_can_richedit', '__return_false', 50);
            }
        }
    }
}
