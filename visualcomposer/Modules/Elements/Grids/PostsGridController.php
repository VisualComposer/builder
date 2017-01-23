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

        /** @see \VisualComposer\Modules\Elements\Grids\PostsGridController::addGlobalVariables */
        $this->addFilter('vcv:frontend:extraOutput', 'addGlobalVariables');
    }

    protected function addGlobalVariables($scripts, $payload)
    {
        /** @see visualcomposer/resources/views/elements/grids/variables.php */
        $variables = [];
        $variables[] = sprintf('<script>%s</script>', vcview('elements/grids/variables'));

        return array_merge($scripts, $variables);
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
        $atts = shortcode_atts(
            [
                'customquery' => '',
                'ids' => '',
                'posttype' => '',
                'limit' => 1000,
                'offset' => 0,
            ],
            $atts
        );
        $query = $this->buildQuery($atts);
        $posts = $postTypeHelper->query($query);

        $output = $this->loopPosts($posts, $content);

        return sprintf('<div class="vce-posts-grid-list">%s</div>', $output);
    }

    protected function buildQuery($atts)
    {
        if ($atts['posttype'] === 'ids') {
            $query = sprintf('post__in=%s&include=%s&orderby=post__in', $atts['ids'], $atts['ids']);
        } else if ($atts['posttype'] === 'custom') {
            $query = str_replace('&amp;', '&', $atts['customquery']);
        } else {
            $postType = $atts['posttype'];
            $limit = (int)$atts['limit'] > 0 ? (int)$atts['limit'] : 1000; // 1000 Is hardcoded maximum
            $offset = (int)$atts['offset'] > 0 ? (int)$atts['offset'] : 0;
            $query = sprintf('post_type=%s&numberposts=%d&offset=%d', $postType, $limit, $offset);
        }

        return $query;
    }

    /**
     * @param $posts
     * @param $template
     *
     * @return string
     */
    protected function loopPosts($posts, $template)
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
