<?php

namespace VisualComposer\Helpers\Access;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;

class EditorPostType implements Helper
{
    public function isEditorEnabled($postType)
    {
        global $post;
        $backup = $post;
        $requestHelper = vchelper('Request');
        $postId = (int)$requestHelper->input('post', 0);
        $postId = $postId ? $postId : $requestHelper->input('post_ID', 0);
        $postId = $postId ? $postId : $requestHelper->input('vcv-source-id', 0);
        $check = true;
        if ($postId) {
            $post = get_post($postId);
        }
        if ($post) {
            $forPostsId = (int)get_option('page_for_posts');
            if ($forPostsId && $post->ID === $forPostsId) {
                $check = false;
            }
        }
        $post = $backup;

        return $check && in_array($postType, $this->getEnabledPostTypes(), true);
    }

    public function getEnabledPostTypes()
    {
        $optionsHelper = vchelper('Options');
        $postTypes = $optionsHelper->get('post-types', ['post', 'page']);

        return (array)vcfilter('vcv:helpers:access:editorPostType', empty($postTypes) ? [] : (array)$postTypes);
    }
}
