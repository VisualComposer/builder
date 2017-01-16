<?php

namespace VisualComposer\Modules\Elements\Grids;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\GridItemTemplate;
use VisualComposer\Helpers\PostType;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Modules\Elements\Traits\AddShortcodeTrait;
use VisualComposer\Modules\Elements\Traits\ShortcodesTrait;

/**
 * Class PostsGridController
 * @package VisualComposer\Modules\Elements\Grids
 */
class PostsGridController extends Container implements Module
{
    use AddShortcodeTrait;
    use EventsFilters;
    use ShortcodesTrait;

    protected $shortcodeTag = 'vcv_posts_grid';

    /**
     * PostsGridController constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\Elements\Traits\ShortcodesTrait::renderEditor */
        $this->addFilter('vcv:ajax:elements:posts_grid:adminNonce', 'renderEditor');

        /** @see \VisualComposer\Modules\Elements\Grids\PostsGridController::render */
        $this->addShortcode($this->shortcodeTag, 'render');
    }

    /**
     * @param $atts
     * @param $content
     * @param $tag
     * @param \VisualComposer\Helpers\PostType $postTypeHelper
     *
     * @return string
     */
    protected function render($atts, $content, $tag, PostType $postTypeHelper)
    {
        // Build Query from $atts
        $query = ''; // TODO: From $atts
        $posts = $postTypeHelper->query($query);

        $output = $this->loopPosts($posts, rawurldecode($content));

        return sprintf('<div class="vce-posts-grid-list">%s</div>', $output);
    }

    /**
     * @param $posts
     * @param $template
     *
     * @return string
     */
    protected function loopPosts($posts, $template)
    {
        global $post;
        $backup = $post;
        $output = '';
        if (is_array($posts)) {
            foreach ($posts as $queryPost) {
                /** @see \VisualComposer\Modules\Elements\Grids\PostsGridController::renderPost */
                $post = $queryPost;
                $compiledTemplate = $this->call(
                    'renderPost',
                    [
                        'template' => $template,
                        'post' => $queryPost,
                    ]
                );
                $output .= trim($compiledTemplate);
            }
        }
        $post = $backup;

        return $output;
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
