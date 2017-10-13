<?php

namespace VisualComposer\Modules\Elements\Grids;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
// use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;

/**
 * Class TemplateVariablesController
 * @package VisualComposer\Modules\Elements\Grids
 */
class PostVariablesController extends Container /*implements Module*/
{
    use EventsFilters;

    /**
     * TemplateVariablesController constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\Elements\Grids\PostVariablesController::templatePostVariables */
        $this->addFilter('vcv:elements:grid_item_template:variable:post_*', 'templatePostVariables');
        /** @see \VisualComposer\Modules\Elements\Grids\PostVariablesController::postAuthor */
        $this->addFilter('vcv:elements:grid_item_template:variable:post_author', 'postAuthor');
        /** @see \VisualComposer\Modules\Elements\Grids\PostVariablesController::postTeaser */
        $this->addFilter('vcv:elements:grid_item_template:variable:post_teaser', 'postTeaser');
        /** @see \VisualComposer\Modules\Elements\Grids\PostVariablesController::postPermalink */
        $this->addFilter('vcv:elements:grid_item_template:variable:post_permalink', 'postPermalink');
        /** @see \VisualComposer\Modules\Elements\Grids\PostVariablesController::featuredImage */
        $this->addFilter('vcv:elements:grid_item_template:variable:featured_image_url', 'featuredImage');
    }

    /**
     * @param $result
     * @param $payload
     *
     * @return string
     */
    protected function templatePostVariables($result, $payload)
    {
        /** @var \WP_Post $post */
        $post = $payload['post'];

        return isset($post->{$payload['key']}) ? $post->{$payload['key']} : '';
    }

    /**
     * @param $result
     * @param $payload
     *
     * @return string
     */
    protected function postAuthor($result, $payload)
    {
        /** @var \WP_Post $post */
        $post = $payload['post'];
        // @codingStandardsIgnoreLine
        $author = get_userdata($post->post_author)->display_name;

        return $author;
    }

    /**
     * @param $result
     * @param $payload
     *
     * @return string
     */
    protected function postTeaser($result, $payload)
    {
        ob_start();
        the_excerpt();
        $result = ob_get_clean();

        return $result;
    }

    /**
     * @param $result
     * @param $payload
     *
     * @return string
     */
    protected function postPermalink($result, $payload)
    {
        return get_the_permalink($payload['post']);
    }

    /**
     * @param $result
     * @param $payload
     *
     * @return bool
     */
    protected function featuredImage($result, $payload)
    {
        /** @var \WP_Post $post */
        $post = $payload['post'];
        $thumbnailId = get_post_meta($post->ID, '_thumbnail_id', true);
        $imageId = $thumbnailId ? $thumbnailId : $post->ID;
        $image = wp_get_attachment_image_src($imageId, 'post-thumbnail');
        $url = isset($image['0']) ? $image['0'] : false;
        if ($url) {
            $result = $url;
        }

        return $result;
    }
}
