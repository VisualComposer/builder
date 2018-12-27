<?php

namespace VisualComposer\Modules\Vendors;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class JetPack extends Container implements Module
{
    use WpFiltersActions;

    protected $postContent = '';

    public function __construct()
    {
        if (!defined('JETPACK__VERSION') || !JETPACK__VERSION) {
            return;
        }

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
        $this->wpAddFilter(
            'wpcom_markdown_transform_pre',
            'wpcomMarkdownTransformPre',
            11
        );

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
