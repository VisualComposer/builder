<?php

namespace VisualComposer\Modules\Elements\Grids\DataSource;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\PostType;
use VisualComposer\Helpers\Traits\EventsFilters;

/**
 * Class CustomPostTypeController
 * @package VisualComposer\Modules\Elements\Grids\DataSource
 */
class CustomPostTypeController extends Container implements Module
{
    use EventsFilters;

    /**
     * PostsController constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\Elements\Grids\DataSource\CustomPostTypeController::queryPosts */
        $this->addFilter('vcv:elements:grids:posts', 'queryPosts');

        /** @see \VisualComposer\Modules\Elements\Grids\DataSource\CustomPostTypeController::addGlobalVariables */
        $this->addFilter('vcv:frontend:extraOutput', 'addGlobalVariables');
    }

    protected function addGlobalVariables($scripts, $payload)
    {
        /** @see visualcomposer/resources/views/elements/grids/sources/custompostvariables.php */
        $variables = [];
        $variables[] = sprintf('<script>%s</script>', vcview('elements/grids/sources/custompostvariables'));

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
        if (isset($payload['source'], $payload['source']['tag'])
            && $payload['source']['tag'] === 'postsGridDataSourceCustomPostType'
        ) {
            // Value:
            $posts = array_merge($posts, $postTypeHelper->query(html_entity_decode($payload['source']['value'])));
        }

        return $posts;
    }
}
