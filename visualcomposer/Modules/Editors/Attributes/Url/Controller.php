<?php

namespace VisualComposer\Modules\Editors\Attributes\Url;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;

class Controller extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Editors\Attributes\Url\Controller::posts */
        $this->addFilter(
            'vcv:ajax:attribute:linkSelector:getPosts',
            'posts'
        );
    }

    /**
     * Get list of 100 most recent posts and pages.
     *
     * @todo Add user permissions check.
     * @return array
     */
    private function posts()
    {
        $args = [
            'posts_per_page' => 100,
            'post_type' => ['post', 'page'],
        ];

        $posts = get_posts($args);

        $results = [];
        foreach ($posts as $post) {
            $results[] = [
                'id' => $post->ID,
                'title' => $post->post_title,
                'url' => get_permalink($post->ID),
            ];
        }

        return $results;
    }
}
