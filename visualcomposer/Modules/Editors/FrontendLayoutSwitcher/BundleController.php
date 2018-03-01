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
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Url;

class BundleController extends Container implements Module
{
    use WpFiltersActions;

    public function __construct()
    {
        if (vcvenv('VCV_TF_DISABLE_BE')) {
            $this->wpAddAction('edit_form_top', 'addCurrentEditorField');
            $this->wpAddAction('add_meta_boxes', 'addBundleStyle');
            $this->wpAddAction('add_meta_boxes', 'addBundleScript');
        }
    }

    protected function addCurrentEditorField($post, EditorPostType $editorPostTypeHelper)
    {
        // @codingStandardsIgnoreLine
        if ($editorPostTypeHelper->isEditorEnabled($post->post_type)) {
            $beEditor = get_post_meta(get_the_ID(), 'vcv-be-editor', true);
            if (empty($beEditor)) {
                $beEditor = 'be';
            }
            echo '<input type="hidden" name="vcv-be-editor" id="vcv-be-editor" value="' . esc_attr($beEditor) . '">';
        }
    }

    protected function addBundleStyle($postType, Url $urlHelper, EditorPostType $editorPostTypeHelper)
    {
        if ($editorPostTypeHelper->isEditorEnabled($postType)) {
            // Add CSS
            wp_enqueue_style(
                'vcv:editors:backendswitcher:style',
                vcvenv('VCV_ENV_EXTENSION_DOWNLOAD')
                    ?
                    content_url() . '/' . VCV_PLUGIN_ASSETS_DIRNAME . '/editor/wpbackendswitch.bundle.css'
                    :
                    $urlHelper->to(
                        'public/dist/wpbackendswitch.bundle.css'
                    ),
                [],
                VCV_VERSION
            );
        }
    }

    protected function addBundleScript(
        $postType,
        Url $urlHelper,
        Frontend $frontendHelper,
        EditorPostType $editorPostTypeHelper
    ) {
        if ($editorPostTypeHelper->isEditorEnabled($postType)) {
            // Add JS
            $scriptBody = sprintf('window.vcvFrontendEditorLink = "%s";', $frontendHelper->getFrontendUrl());
            echo sprintf(
                '<script type="text/javascript">%s</script>',
                $scriptBody
            );
            wp_enqueue_script(
                'vcv:editors:backendswitcher:script',
                vcvenv('VCV_ENV_EXTENSION_DOWNLOAD')
                    ?
                    content_url() . '/' . VCV_PLUGIN_ASSETS_DIRNAME . '/editor/wpbackendswitch.bundle.js'
                    :
                    $urlHelper->to(
                        'public/dist/wpbackendswitch.bundle.js'
                    ),
                ['vcv:assets:vendor:script'],
                VCV_VERSION
            );
        }
    }
}
