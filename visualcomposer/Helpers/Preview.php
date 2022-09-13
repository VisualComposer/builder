<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;

/**
 * Class Preview
 * Note: preview page is a page where user can browse current changes
 * before he will save it in builder editor.
 *
 * @package VisualComposer\Helpers
 */
class Preview implements Helper
{
    /**
     * Get preview id of certain post.
     *
     * @param $sourceId
     *
     * @return false|int
     */
    public function getPreviewId($sourceId)
    {
        $frontendHelper = vchelper('Frontend');
        if (!$frontendHelper->isPreview()) {
            return false;
        }

        global $post;

        $previewPosts = $this->getPostPreviewList($post, $sourceId);

        if ($previewPosts) {
            $id = $previewPosts[0]->ID;
        } else {
            $id = false;
        }

        return $id;
    }

    /**
     * Generate post preview from post.
     *
     * @param object $post
     * @param int $sourceId
     *
     * @return array
     */
    public function generatePreview($post, $sourceId)
    {
        $previewPost = [];
        // @codingStandardsIgnoreLine
        if (in_array($post->post_status, ['publish', 'future', 'private'])) {
            $previewPost[0]['post_name'] = $post->ID . '-autosave-v1';
        } else {
            $previewPost[0]['post_name'] = $post->ID . '-revision-v1';
        }
        // @codingStandardsIgnoreLine
        $previewPost[0]['post_content'] = $post->post_content;
        $previewPost[0]['post_status'] = 'inherit';
        $previewPost[0]['post_type'] = 'revision';
        $previewPost[0]['comment_status'] = 'closed';
        $previewPost[0]['ping_status'] = 'closed';
        $previewPost[0]['author'] = $post->author;
        $previewPost[0]['post_parent'] = $post->ID;

        $previewPosts = $this->getPostPreviewList($post, $sourceId);
        if ($previewPosts) {
            $previewPost[0]['ID'] = $previewPosts[0]->ID;
        } else {
            $previewPost[0]['ID'] = null;
        }

        return $previewPost;
    }

    /**
     * Get all previews of certain post of certain author.
     *
     * @param $post
     * @param $postParent
     *
     * @return int[]|\WP_Post[]
     */
    public function getPostPreviewList($post, $postParent)
    {
        return get_posts(
            [
                'post_parent' => $postParent,
                'author' => $post->author,
                'post_status' => 'inherit',
                'post_type' => 'revision',
                'orderby' => 'ID',
                'order' => 'DESC',
            ]
        );
    }

    /**
     * Replace provided post id with corresponding preview id.
     *
     * @param int $sourceId
     *
     * @return int
     */
    public function updateSourceIdWithPreviewId($sourceId)
    {
        $frontendHelper = vchelper('Frontend');

        if ($frontendHelper->isPreview()) {
            $previewPostList = $this->getPostPreviewList(get_post($sourceId), $sourceId);
            if (!empty($previewPostList[0]) && is_object($previewPostList[0])) {
                $sourceId = $previewPostList[0]->ID;
            }
        }

        return (int)$sourceId;
    }

    /**
     * Update post id with autosave id.
     *
     * @param int $sourceId
     *
     * @return int
     */
    public function updateSourceIdWithAutosaveId($sourceId)
    {
        $frontendHelper = vchelper('Frontend');

        if ($frontendHelper->isPreview()) {
            $autosavePreview = wp_get_post_autosave($sourceId);

            if ($autosavePreview) {
                $sourceId = $autosavePreview->ID;
            }
        }

        return (int)$sourceId;
    }

    /**
     * Replace provided post object with corresponding preview object.
     *
     * @param \WP_Post $post
     *
     * @return \WP_Post
     */
    public function updateSourcePostWithPreviewPost($post)
    {
        $frontendHelper = vchelper('Frontend');

        if ($frontendHelper->isPreview()) {
            $previewPostList = $this->getPostPreviewList($post, $post->ID);
            if (!empty($previewPostList[0]) && is_object($previewPostList[0])) {
                $post = $previewPostList[0];
            }
        }

        return $post;
    }

    /**
     * Update provided post object with corresponding autosave object.
     *
     * @param \WP_Post $post
     *
     * @return \WP_Post
     */
    public function updateSourcePostWithAutosavePost($post)
    {
        $frontendHelper = vchelper('Frontend');

        if ($frontendHelper->isPreview()) {
            $autosavePreview = wp_get_post_autosave($post->ID);

            if ($autosavePreview) {
                $post = $autosavePreview;
            }
        }

        return $post;
    }
}
