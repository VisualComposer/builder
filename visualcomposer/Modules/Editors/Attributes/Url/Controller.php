<?php

namespace VisualComposer\Modules\Editors\Attributes\Url;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
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
     * Get list of 20 most recent posts and pages with ability to search.
     *
     * @todo Add user permissions check.
     *
     * @param Request $request
     *
     * @return array
     */
    private function posts(Request $request)
    {
        $search = $request->input('vcv-search');

        $args = [
            'posts_per_page' => 20,
            'post_type' => get_post_types('', 'names'),
            's' => $search,
        ];

        $posts = get_posts($args);

        $results = [];
        foreach ($posts as $post) {
            $results[] = [
                'id' => $post->ID,
                'title' => $post->post_title,
                'url' => get_permalink($post->ID),
                'type' => $post->post_type,
            ];
        }

        return $results;
    }
}
