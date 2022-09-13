<?php

namespace VisualComposer\Modules\Editors\Settings\WordPressSettings;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\PostType;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class DiscussionController extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    public function __construct()
    {
        $this->addFilter(
            'vcv:dataAjax:setData',
            'setData'
        );
        $this->addFilter(
            'vcv:frontend:head:extraOutput',
            'outputDiscussion'
        );
    }

    /**
     * @param $response
     * @param $payload
     *
     * @param \VisualComposer\Helpers\PostType $postTypeHelper
     *
     * @return mixed
     */
    protected function outputDiscussion(
        $response,
        $payload,
        PostType $postTypeHelper
    ) {
        $currentUserAccessHelper = vchelper('AccessCurrentUser');
        $currentPost = $postTypeHelper->get();
        // @codingStandardsIgnoreStart
        $currentPostType = $currentPost->post_type;
        $pingStatus = $currentPost->ping_status;
        $commentStatus = $currentPost->comment_status;
        if (
            $currentPostType && $currentUserAccessHelper->wpAll(
                [get_post_type_object($currentPost->post_type)->cap->publish_posts, $currentPost->ID]
            )->get()
        ) {
            // @codingStandardsIgnoreEnd
            $discussionVariables = [];
            if (
                comments_open($currentPost) ||
                pings_open($currentPost) ||
                post_type_supports($currentPostType, 'comments')
            ) {
                $discussionVariables[] = vcview(
                    'partials/variableTypes/variable',
                    [
                        'key' => 'VCV_PING_STATUS',
                        'value' => $pingStatus,
                    ]
                );
                $discussionVariables[] = vcview(
                    'partials/variableTypes/variable',
                    [
                        'key' => 'VCV_COMMENT_STATUS',
                        'value' => $commentStatus,
                    ]
                );
            }
            $response = array_merge($response, $discussionVariables);
        }
        return $response;
    }

    /**
     * Set comment and ping status
     *
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\Request $requestHelper
     *
     * @return mixed
     */
    protected function setData($response, $payload, Request $requestHelper)
    {
        $currentPageId = vchelper('Preview')->updateSourceIdWithAutosaveId($payload['sourceId']);
        if (
            $requestHelper->exists('vcv-settings-comment-status')
            && $requestHelper->exists('vcv-settings-ping-status')
        ) {
            // @codingStandardsIgnoreStart
            $postCommentStatus = $requestHelper->input('vcv-settings-comment-status');
            $postPingStatus = $requestHelper->input('vcv-settings-ping-status');
            // @codingStandardsIgnoreEnd
            wp_update_post(
                ['ID' => $currentPageId, 'comment_status' => $postCommentStatus, 'ping_status' => $postPingStatus]
            );
        }

        return $response;
    }
}
