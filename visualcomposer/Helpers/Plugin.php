<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;

/**
 * Class Plugin.
 */
class Plugin implements Helper
{
    /**
     * Check if plugin is used certain amount of days.
     *
     * @param int $days
     *
     * @return bool
     */
    public function isActivelyUsed($days = 5)
    {
        $optionsHelper = vchelper('Options');
        $pluginActivationDate = $optionsHelper->get('plugin-activation');
        if (!empty($pluginActivationDate) && ((int)$pluginActivationDate + ($days * DAY_IN_SECONDS)) < time()) {
            // More than 1 month used current license-type
            return true;
        }

        return false;
    }

    /**
     * Check if user has certain amount of posts.
     *
     * @param $posts
     *
     * @return bool
     */
    public function isHasCertainPostsNumber($posts = 3)
    {
        $vcvPosts = new \WP_Query(
            [
                'post_type' => 'any',
                'post_status' => ['publish', 'pending', 'draft', 'auto-draft', 'future', 'private'],
                'posts_per_page' => $posts,
                'meta_key' => VCV_PREFIX . 'pageContent',
                'suppress_filters' => true,
            ]
        );
        // @codingStandardsIgnoreLine
        return (int)$vcvPosts->found_posts >= $posts;
    }
}
