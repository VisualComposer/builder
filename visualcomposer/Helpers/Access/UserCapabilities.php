<?php

namespace VisualComposer\Helpers\Access;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;

class UserCapabilities implements Helper
{
    public function canEdit($sourceId)
    {
        $currentUserAccessHelper = vchelper('AccessCurrentUser');
        // @codingStandardsIgnoreStart
        $post = get_post($sourceId);
        if (!$post) {
            return false;
        }
        if ($post->post_status === 'trash') {
            return false;
        }
        if ('page' !== $post->post_type) {
            if ('publish' === $post->post_status
                && $currentUserAccessHelper->wpAll(
                    [get_post_type_object($post->post_type)->cap->edit_published_posts, $post->ID]
                )->get()
            ) {
                return true;
            } elseif ('publish' !== $post->post_status
                && $currentUserAccessHelper->wpAll(
                    [get_post_type_object($post->post_type)->cap->edit_posts, $post->ID]
                )->get()
            ) {
                return true;
            }
        } elseif ('page' === $post->post_type && $currentUserAccessHelper->wpAll(['edit_pages', $post->ID])->get()) {
            return true;
        }

        // @codingStandardsIgnoreEnd
        return false;
    }

    public function resetCapabilities($postType)
    {
        // @codingStandardsIgnoreLine
        global $wp_roles;
        // @codingStandardsIgnoreLine
        $wpRoles = $wp_roles;
        $optionsHelper = vchelper('Options');

        $optionsHelper->delete($postType . '-capabilities-set');
        $wpRoles->remove_cap('contributor', 'read_' . $postType);
        $wpRoles->remove_cap('contributor', 'edit_' . $postType);
        $wpRoles->remove_cap('contributor', 'delete_' . $postType);
        $wpRoles->remove_cap('contributor', 'edit_' . $postType . 's');
        $wpRoles->remove_cap('contributor', 'delete_' . $postType . 's');
        $optionsHelper->set($postType . '-capability-migration', 1);
    }
}
