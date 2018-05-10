<?php

namespace VisualComposer\Modules\Editors\Attributes\Url;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Access\CurrentUser;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;

class Controller extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Editors\Attributes\Url\Controller::posts */
        $this->addFilter(
            'vcv:ajax:attribute:linkSelector:getPosts:adminNonce',
            'posts'
        );
    }

    /**
     * Get list of 20 most recent posts and pages with ability to search.
     *
     * @param Request $request
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\Access\CurrentUser $currentUserAccessHelper
     *
     * @return array
     */
    protected function posts(Request $request, Request $requestHelper, CurrentUser $currentUserAccessHelper)
    {
        $results = [];
        $sourceId = (int)$requestHelper->input('vcv-source-id');
        if ($sourceId && $currentUserAccessHelper->wpAll(['edit_posts', $sourceId])->get()) {
            $search = $request->input('vcv-search');

            $args = [
                'posts_per_page' => $search ? -1 : 20,
                'post_type' => get_post_types(['public' => true], 'names'),
                's' => $search,
            ];
            $posts = get_posts($args);

            foreach ($posts as $post) {
                $results[] = [
                    'id' => $post->ID,
                    // @codingStandardsIgnoreLine
                    'title' => $post->post_title,
                    'url' => vcfilter('vcv:linkSelector:url', get_permalink($post->ID), ['post' => $post]),
                    // @codingStandardsIgnoreLine
                    'type' => $post->post_type,
                ];
            }
        }

        return $results;
    }
}
