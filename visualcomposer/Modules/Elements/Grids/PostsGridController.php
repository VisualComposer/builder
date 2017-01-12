<?php

namespace VisualComposer\Modules\Elements\Grids;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\GridItemTemplate;
use VisualComposer\Helpers\PostType;
use VisualComposer\Modules\Elements\Traits\AddShortcodeTrait;

/**
 * Class PostsGridController
 * @package VisualComposer\Modules\Elements\Grids
 */
class PostsGridController extends Container implements Module
{
    use AddShortcodeTrait;

    /**
     * PostsGridController constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\Elements\Grids\PostsGridController::render */
        $this->addShortcode('vcv_posts_grid', 'render');
    }

    /**
     * @param $atts
     * @param $content
     * @param $tag
     * @param \VisualComposer\Helpers\PostType $postTypeHelper
     *
     * @return string
     */
    private function render($atts, $content, $tag, PostType $postTypeHelper)
    {
        // Build Query from $atts
        $query = ''; // TODO: From $atts
        $posts = $postTypeHelper->query($query);

        return $this->loopPosts($content, $posts, $tag);
    }

    /**
     * @param $posts
     * @param $template
     * @param $gridItemTag
     *
     * @return string
     */
    protected function loopPosts($posts, $template, $gridItemTag)
    {
        $output = '';
        foreach ($posts as $post) {
            /** @see \VisualComposer\Modules\Elements\Grids\PostsGridController::renderPost */
            $template = $this->call(
                'renderPost',
                [
                    'template' => $template,
                    'payload' => [
                        'post' => $post,
                        'tag' => $gridItemTag,
                    ],
                ]
            );
            $output .= trim($template);
        }

        return $output;
    }

    /**
     * @param $template
     * @param $payload
     *
     * @param \VisualComposer\Helpers\GridItemTemplate $gridItemTemplateHelper
     *
     * @return mixed
     */
    protected function renderPost($template, $payload, GridItemTemplate $gridItemTemplateHelper)
    {
        $newTemplate = $gridItemTemplateHelper->parseTemplate($template, $payload);

        return $newTemplate;
    }
}
