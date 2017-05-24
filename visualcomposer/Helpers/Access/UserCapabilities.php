<?php

namespace VisualComposer\Helpers\Access;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;
use VisualComposer\Helpers\Access\Role as AccessFactory;

class UserCapabilities extends AccessFactory implements Helper
{
    public function canEdit($sourceId)
    {
        if ($this->getValidAccess()) {
            $currentUserAccessHelper = vchelper('AccessCurrentUser');

            $post = get_post($sourceId);
            // @codingStandardsIgnoreLine
            if ('post' === $post->post_type) {
                // @codingStandardsIgnoreLine
                if ('publish' === $post->post_status && $currentUserAccessHelper->wpAll([get_post_type_object($post->post_type)->cap->edit_published_posts, $post->ID])->get()) {
                    return true;
                    // @codingStandardsIgnoreLine
                } elseif ('publish' !== $post->post_status && $currentUserAccessHelper->wpAll([get_post_type_object($post->post_type)->cap->edit_posts, $post->ID])->get()) {
                    return true;
                }
                // @codingStandardsIgnoreLine
            } else if ('page' === $post->post_type && $currentUserAccessHelper->wpAll([get_post_type_object($post->post_type)->cap->edit_pages, $post->ID])->get()) {
                return true;
            }

            return false;
        }
    }
}
