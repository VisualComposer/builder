<?php

namespace VisualComposer\Modules\Elements\Grids;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;

/**
 * Class TemplateVariablesController
 * @package VisualComposer\Modules\Elements\Grids
 */
class PostVariablesController extends Container implements Module
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
        $this->addFilter('vcv:elements:grid_item_template:variable:the_excerpt', 'postExcerpt');
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
        $author = get_userdata($post->post_author)->display_name;

        return $author;
    }

    /**
     * @param $result
     * @param $payload
     *
     * @return string
     */
    protected function postExcerpt($result, $payload)
    {
        /** @var \WP_Post $post */
        $post = $payload['post'];
        $excerpt = get_the_excerpt($post);

        return $excerpt;
    }
}
