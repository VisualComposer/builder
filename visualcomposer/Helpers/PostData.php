<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;

class PostData implements Helper
{
    public function getFeaturedImage()
    {
        global $post;
        $urlHelper = vchelper('Url');

        $postThumbnailUrl = get_the_post_thumbnail_url($post->ID);
        if (empty($postThumbnailUrl)) {
            $postThumbnailUrl = $urlHelper->assetUrl('images/spacer.png');
        }

        return $urlHelper->query(
            $postThumbnailUrl,
            [
                'vcv-dynamic-field' => 'featured_image',
            ]
        );
    }

    public function getPostAuthorImage()
    {
        global $post;
        $urlHelper = vchelper('Url');

        // @codingStandardsIgnoreLine
        $avatarData = get_avatar_data($post->post_author);
        $url = isset($avatarData['url']) ? $avatarData['url'] : '';
        if (empty($url)) {
            $url = $urlHelper->assetUrl('images/spacer.png');
        }

        return $urlHelper->query(
            $url,
            [
                'vcv-dynamic-field' => 'post_author_image',
            ]
        );
    }

    public function getPostAuthor()
    {
        global $post;

        // @codingStandardsIgnoreLine
        return get_the_author_meta('display_name', $post->post_author);
    }

    public function getPostTitle()
    {
        return get_the_title();
    }

    public function getPostId()
    {
        return get_the_ID();
    }

    public function getPostExcerpt()
    {
        return get_the_excerpt();
    }

    public function getPostType()
    {
        global $post;

        // @codingStandardsIgnoreLine
        $postTypeObject = get_post_type_object($post->post_type);

        // @codingStandardsIgnoreLine
        return is_object($postTypeObject) ? $postTypeObject->labels->singular_name : $post->post_type;
    }

    public function getBlogLogo()
    {
        $urlHelper = vchelper('Url');
        $customLogoId = get_theme_mod('custom_logo');
        $url = '';
        if (!empty($customLogoId)) {
            $url = wp_get_attachment_image_url($customLogoId);
        }
        if (empty($url)) {
            $url = $urlHelper->assetUrl('images/spacer.png');
        }

        return $urlHelper->query(
            $url,
            [
                'vcv-dynamic-field' => 'wp_blog_logo',
            ]
        );
    }
}
