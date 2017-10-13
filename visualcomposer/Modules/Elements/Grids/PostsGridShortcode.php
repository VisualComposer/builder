<?php

namespace VisualComposer\Modules\Elements\Grids;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
// use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\PostsGridPostIterator;
use VisualComposer\Modules\Elements\Traits\AddShortcodeTrait;

class PostsGridShortcode extends Container /*implements Module*/
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
                'unique_id' => '',
                'source' => '',
                'pagination' => '',
                'pagination_color' => '',
                'pagination_per_page' => '',
            ],
            $atts
        );
        $atts['source'] = json_decode(rawurldecode($atts['source']), true);
        $posts = vcfilter(
            'vcv:elements:grids:posts',
            [],
            [
                'atts' => $atts,
                'tag' => $tag,
            ]
        );
        if (!count($posts)) {
            $output = '';
        } else {
            $postsOutput = $postsGridPostIteratorHelper->loopPosts($posts, $content);
            $output = sprintf('<div class="vce-posts-grid-list">%s</div>', $postsOutput);
            $output = vcfilter(
                'vcv:elements:grids:output',
                $output,
                [
                    'atts' => $atts,
                    'tag' => $tag,
                ]
            );
        }

        return $output;
    }
}
