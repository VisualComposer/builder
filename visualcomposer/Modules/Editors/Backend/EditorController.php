<?php

namespace VisualComposer\Modules\Editors\Backend;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Gutenberg;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Class EditorController
 * @package VisualComposer\Modules\Editors\Backend
 */
class EditorController extends Container implements Module
{
    use WpFiltersActions;

    /**
     * EditorController constructor.
     */
    public function __construct()
    {
        $this->wpAddAction('edit_form_after_title', 'disablePostContentEditor');
    }

    /**
     * Disable the wp_editor (tinymce) in backend when page is created by Visual Composer
     * This helps to avoid unwanted markup changes (htmlentities or tinymce html changes)
     * Affects only created by Visual Composer
     *
     * @param $post
     * @param \VisualComposer\Helpers\Gutenberg $gutenbergHelper
     * @param \VisualComposer\Helpers\Request $requestHelper
     *
     * @throws \ReflectionException
     * @throws \VisualComposer\Framework\Illuminate\Container\BindingResolutionException
     */
    protected function disablePostContentEditor($post, Gutenberg $gutenbergHelper, Request $requestHelper)
    {
        global $pagenow;
        if ($pagenow === 'post-new.php' || $pagenow === 'post.php') {
            // If page was created by Visual Composer
            if (!$requestHelper->exists('classic-editor') && $gutenbergHelper->isVisualComposerPage($post->ID)) {
                // to avoid unnecessary issues with content modifications remove the tinymce at all
                // @codingStandardsIgnoreStart
                global $_wp_post_type_features;
                if (isset($_wp_post_type_features[ $post->post_type ]['editor'])) {
                    unset($_wp_post_type_features[ $post->post_type ]['editor']);
                    // Output textarea for 3rd party plugins
                    echo '<textarea name="content" id="content" class="wp-editor-area" style="display: none;">' . esc_textarea($post->post_content) . '</textarea>';
                }
                // @codingStandardsIgnoreEnd
            }
        }
    }
}
