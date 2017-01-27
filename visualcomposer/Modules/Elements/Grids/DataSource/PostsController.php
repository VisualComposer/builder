<?php

namespace VisualComposer\Modules\Elements\Grids\DataSource;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\PostType;
use VisualComposer\Helpers\Traits\EventsFilters;

/**
 * Class PostsController
 * @package VisualComposer\Modules\Elements\Grids\DataSource
 */
class PostsController extends Container implements Module
{
    use EventsFilters;

    /**
     * PostsController constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\Elements\Grids\DataSource\PostsController::queryPosts */
        $this->addFilter('vcv:elements:grids:posts', 'queryPosts');

        /** @see \VisualComposer\Modules\Elements\Grids\DataSource\PostsController::addGlobalVariables */
        $this->addFilter('vcv:frontend:extraOutput', 'addGlobalVariables');
    }

    protected function addGlobalVariables($scripts, $payload)
    {
        /** @see visualcomposer/resources/views/elements/grids/sources/postvariables.php */
        $variables = [];
        $variables[] = sprintf('<script>%s</script>', vcview('elements/grids/sources/postvariables'));

        return array_merge($scripts, $variables);
    }

    /**
     * @param $posts
     * @param $payload
     * @param \VisualComposer\Helpers\PostType $postTypeHelper
     *
     * @return array
     */
    protected function queryPosts($posts, $payload, PostType $postTypeHelper)
    {
        if (isset($payload['atts']['source'], $payload['atts']['source']['tag'])
            && $payload['atts']['source']['tag'] === 'postsGridDataSourcePost'
        ) {
            // Value:
            $posts = array_merge(
                $posts,
                $postTypeHelper->query(html_entity_decode($payload['atts']['source']['value']))
            );
        }

        return $posts;
    }
}
