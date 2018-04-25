<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Helper;

/**
 * Class PostsGridPostIterator
 * @package VisualComposer\Helpers
 */
class PostsGridPostIterator extends Container implements Helper
{
    protected $gridTemplateHelper;

    public function __construct(GridItemTemplate $gridItemTemplateHelper)
    {
        $this->gridTemplateHelper = $gridItemTemplateHelper;
    }

    /**
     * @param $posts
     * @param $template
     *
     * @return string
     */
    public function loopPosts($posts, $template)
    {
        // @codingStandardsIgnoreStart
        global $post, $shortcode_tags;

        $backupTags = $shortcode_tags;
        // @codingStandardsIgnoreEnd
        remove_all_shortcodes();
        $backup = $post;
        $output = '';
        if (is_array($posts)) {
            foreach ($posts as $queryPost) {
                $post = $queryPost;
                setup_postdata($post);
                $compiledTemplate = $this->renderPost($template, $queryPost);
                $output .= trim($compiledTemplate);
                wp_reset_postdata();
            }
        }
        $post = $backup;
        // @codingStandardsIgnoreStart
        $shortcode_tags = $backupTags;

        // @codingStandardsIgnoreEnd
        return strip_shortcodes($output);
    }

    /**
     * @param $template
     * @param $post
     *
     * @return mixed
     */
    protected function renderPost($template, $post)
    {
        $newTemplate = $this->gridTemplateHelper->parseTemplate($template, $post);

        return $newTemplate;
    }
}
