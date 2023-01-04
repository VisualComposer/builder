<?php

namespace VisualComposer\Modules\Vendors\Plugins;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Backward compatibility with "Jetpack" wordPress plugin.
 *
 * @see https://wordpress.org/plugins/jetpack/
 */
class JetPackController extends Container implements Module
{
    use WpFiltersActions;

    protected $postContent = '';

    public function __construct()
    {
        if (!defined('JETPACK__VERSION') || !JETPACK__VERSION) {
            return;
        }

        /** @see \VisualComposer\Modules\Vendors\Plugins\JetPackController::wpInsertPostData */
        $this->wpAddFilter(
            'wp_insert_post_data',
            'wpInsertPostData',
            3
        );
    }

    /**
     * @param $content
     *
     * @return mixed
     */
    protected function wpInsertPostData($content)
    {
        /** @see \VisualComposer\Modules\Vendors\Plugins\JetPackController::wpcomMarkdownTransformPre */
        $this->wpAddFilter(
            'wpcom_markdown_transform_pre',
            'wpcomMarkdownTransformPre',
            11
        );

        /** @see \VisualComposer\Modules\Vendors\Plugins\JetPackController::wpcomMarkdownTransformPost */
        $this->wpAddFilter(
            'wpcom_markdown_transform_post',
            'wpcomMarkdownTransformPost',
            12
        );

        return $content;
    }

    /**
     * @param $text
     *
     * @return mixed
     */
    protected function wpcomMarkdownTransformPre($text)
    {
        $this->postContent = $text;

        return $text;
    }

    /**
     * @param $text
     *
     * @return string
     */
    protected function wpcomMarkdownTransformPost($text)
    {
        return $this->postContent;
    }
}
