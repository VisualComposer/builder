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
        $post = get_post($sourceId);
        if (!$post) {
            return false;
        }

        // @codingStandardsIgnoreLine
        if ($post->post_status === 'trash') {
            return false;
        }
        // @codingStandardsIgnoreLine
        $postType = $post->post_type;
        $postTypeObject = get_post_type_object($postType);
        if (!$postTypeObject) {
            return false;
        }
        $forPostsId = (int)get_option('page_for_posts');
        $hasAccess = true;
        if ($forPostsId && $post->ID === $forPostsId) {
            $hasAccess = false;
        }
        $hasAccess = $hasAccess && current_user_can('edit_post', $sourceId);
        // @codingStandardsIgnoreLine
        $hasAccess = $hasAccess && $this->isEditorEnabled($post->post_type);

        return $hasAccess;
    }

    public function isEditorEnabled($postType)
    {
        $currentUserAccessHelper = vchelper('AccessCurrentUser');
        if ($postType === 'vcv_tutorials') {
            return current_user_can('edit_vcv_tutorialss');
        }

        $hasAccess = $currentUserAccessHelper->part('post_types')->getCapRule('edit_' . $postType);

        // Override hasAccess for VCWB post types
        if (in_array($postType, ['vcv_headers', 'vcv_footers', 'vcv_sidebars', 'vcv_archives', 'vcv_layouts'])) {
            $hasAccess = $currentUserAccessHelper->part('dashboard')->can('addon_theme_builder', false)->get();
        } elseif (in_array($postType, ['vcv_templates'])) {
            $hasAccess = $currentUserAccessHelper->part('dashboard')->can('addon_global_templates', false)->get();
        } elseif (in_array($postType, ['vcv_popups'])) {
            $hasAccess = $currentUserAccessHelper->part('dashboard')->can('addon_popup_builder', false)->get();
        }

        return $hasAccess;
    }
}
