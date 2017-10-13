<?php

namespace VisualComposer\Modules\Elements\Grids\DataSource;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
// use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\PostType;
use VisualComposer\Helpers\Traits\EventsFilters;

/**
 * Class PagesController
 * @package VisualComposer\Modules\Elements\Grids\DataSource
 */
class PagesController extends Container /*implements Module*/
{
    use EventsFilters;

    /**
     * PostsController constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\Elements\Grids\DataSource\PagesController::queryPosts */
        $this->addFilter('vcv:elements:grids:posts', 'queryPosts');
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
            && $payload['atts']['source']['tag'] === 'postsGridDataSourcePage'
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
