<?php

namespace VisualComposer\Modules\Hub\Download\Actions;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;
use WP_Query;

class PostUpdateAction extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Hub\Download\Actions\PostUpdateAction::getUpdateablePosts */
        $this->addFilter('vcv:hub:findUpdatePosts:element/*', 'getUpdateablePosts');
        $this->addEvent('vcv:hub:removePostUpdate:post/*', 'removePostFromUpdatesList');
    }

    protected function getUpdateablePosts($posts, $payload)
    {
        $event = $payload['action'];
        $vcvPosts = new WP_Query(
            [
                'post_type' => 'any',
                'post_status' => ['publish', 'pending', 'draft', 'auto-draft'], // TODO: future, private
                'posts_per_page' => -1,
                'meta_key' => VCV_PREFIX . 'pageContent',
                'meta_value' => rawurlencode('"tag":"' . str_replace('element/', '', $event) . '"'),
                'meta_compare' => 'LIKE',
            ]
        );
        while ($vcvPosts->have_posts()) {
            $vcvPosts->the_post();
            $posts[] = get_the_ID();
        }
        wp_reset_postdata();

        return $posts;
    }

    protected function removePostFromUpdatesList($id)
    {
        $optionsHelper = vchelper('Options');
        $updatePosts = $optionsHelper->get('hubAction:updatePosts', []);
        $key = array_search($id, $updatePosts);
        if ($key !== false) {
            unset($updatePosts[ $key ]);
            $updatePosts = array_values($updatePosts);
            $optionsHelper->set('hubAction:updatePosts', $updatePosts);
        }
    }
}
