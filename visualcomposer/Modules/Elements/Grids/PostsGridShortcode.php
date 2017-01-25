<?php

namespace VisualComposer\Modules\Elements\Grids;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\PostsGridPostIterator;
use VisualComposer\Modules\Elements\Traits\AddShortcodeTrait;

class PostsGridShortcode extends Container implements Module
{
    use AddShortcodeTrait;

    protected $shortcodeTag = 'vcv_posts_grid';

    /**
     * PostsGridController constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\Elements\Grids\PostsGridShortcode::render */
        $this->addShortcode($this->shortcodeTag, 'render');
    }

    /**
     * @param $atts
     * @param $content
     * @param $tag
     * @param \VisualComposer\Helpers\PostsGridPostIterator $postsGridPostIteratorHelper
     *
     * @return string
     */
    protected function render($atts, $content, $tag, PostsGridPostIterator $postsGridPostIteratorHelper)
    {
        // Build Query from $atts
        $atts = shortcode_atts(
            [
                'source' => '',
            ],
            $atts
        );
        $posts = vcfilter(
            'vcv:elements:grids:posts',
            [],
            [
                'tag' => $tag,
                'source' => json_decode(rawurldecode($atts['source']), true),
            ]
        );
        $output = $postsGridPostIteratorHelper->loopPosts($posts, $content);

        return sprintf('<div class="vce-posts-grid-list">%s</div>', $output);
    }
}
