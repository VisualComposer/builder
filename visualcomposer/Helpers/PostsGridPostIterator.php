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
        $globalsHelper = vchelper('Globals');
        $globalsHelper->backup('loopPosts.post', 'post');
        $output = '';
        if (is_array($posts)) {
            foreach ($posts as $queryPost) {
                $globalsHelper->set('post', $queryPost);
                setup_postdata($queryPost);
                $compiledTemplate = $this->renderPost($template, $queryPost);
                $output .= trim($compiledTemplate);
                $output = vcfilter('vcv:frontend:content', $output);
                wp_reset_postdata();
            }
        }
        $globalsHelper->restore('loopPosts.post', 'post');

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
