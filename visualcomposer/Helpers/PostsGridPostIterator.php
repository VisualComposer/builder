<?php

namespace VisualComposer\Helpers;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Helper;

/**
 * Class PostsGridPostIterator
 * @package VisualComposer\Helpers
 */
class PostsGridPostIterator extends Container implements Helper
{
    /**
     * @param $posts
     * @param $template
     *
     * @return string
     */
    public function loopPosts($posts, $template)
    {
        global $post, $shortcode_tags;
        $backupTags = $shortcode_tags;
        remove_all_shortcodes();
        $backup = $post;
        $output = '';
        if (is_array($posts)) {
            foreach ($posts as $queryPost) {
                /** @see \VisualComposer\Modules\Elements\Grids\PostsGridController::renderPost */
                $post = $queryPost;
                setup_postdata($post);
                $compiledTemplate = $this->call(
                    'renderPost',
                    [
                        'template' => $template,
                        'post' => $queryPost,
                    ]
                );
                $output .= trim($compiledTemplate);
                wp_reset_postdata();
            }
        }
        $post = $backup;
        $shortcode_tags = $backupTags;

        return strip_shortcodes($output);
    }

    /**
     * @param $template
     * @param $post
     * @param \VisualComposer\Helpers\GridItemTemplate $gridItemTemplateHelper
     *
     * @return mixed
     */
    protected function renderPost($template, $post, GridItemTemplate $gridItemTemplateHelper)
    {
        $newTemplate = $gridItemTemplateHelper->parseTemplate($template, $post);

        return $newTemplate;
    }
}
