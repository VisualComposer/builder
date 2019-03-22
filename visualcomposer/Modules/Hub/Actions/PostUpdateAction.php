<?php

namespace VisualComposer\Modules\Hub\Actions;

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
use WP_Query;

class PostUpdateAction extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        $this->addFilter('vcv:hub:findUpdatePosts:element/*', 'getUpdateablePosts');
        $this->addEvent('vcv:hub:removePostUpdate:post/*', 'removePostFromUpdatesList');
        $this->addFilter('vcv:ajax:hub:action:postUpdate:skipPost:adminNonce', 'ajaxSkipPost');
    }

    protected function getUpdateablePosts($posts, $payload, CurrentUser $currentUserAccessHelper)
    {
        $event = $payload['action'];
        $vcvPosts = new WP_Query(
            [
                'post_type' => get_post_types(['public' => true], 'names'),
                'post_status' => ['publish', 'pending', 'draft', 'auto-draft'], // TODO: future, private
                'posts_per_page' => -1,
                'meta_key' => VCV_PREFIX . 'pageContent',
                'meta_value' => rawurlencode('"tag":"' . str_replace('element/', '', $event) . '"'),
                'meta_compare' => 'LIKE',
                'suppress_filters' => true,
            ]
        );
        while ($vcvPosts->have_posts()) {
            $vcvPosts->the_post();
            $postId = get_the_ID();
            if ($currentUserAccessHelper->wpAll(
            // @codingStandardsIgnoreLine
                [get_post_type_object($vcvPosts->post->post_type)->cap->edit_posts, $postId]
            )->get()
            ) {
                $posts[] = $postId;
            }
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

        return true;
    }

    protected function ajaxSkipPost($response, $payload, Request $requestHelper)
    {
        if ($requestHelper->exists('vcv-source-id')) {
            $this->removePostFromUpdatesList(intval($requestHelper->input('vcv-source-id')));

            return ['status' => true];
        }

        return ['status' => false];
    }
}
