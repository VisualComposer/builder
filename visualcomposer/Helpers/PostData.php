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
            $url = wp_get_attachment_image_url($customLogoId, 'full');
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

    public function getPostCategories()
    {
        $categoriesList = get_the_category_list(', ');

        return $categoriesList;
    }

    public function getPostTags()
    {
        $tagsList = get_the_term_list(0, 'post_tag', '', ', ', '');

        return $tagsList;
    }

    public function getPostCommentCount()
    {
        $commentCount = get_comments_number();

        return $commentCount;
    }

    public function getPostDate()
    {
        $date = get_the_date();

        return $date;
    }

    public function getPostModifyDate()
    {
        $date = get_the_modified_date();

        return $date;
    }

    public function getPostParentName()
    {
        global $post;
        $parentId = wp_get_post_parent_id($post);

        if ($parentId) {
            $parentPost = get_post($parentId);

            //@codingStandardsIgnoreLine
            return $parentPost->post_title;
        }

        return false;
    }

    public function getPostAuthorBio()
    {
        global $post;
        //@codingStandardsIgnoreLine
        $description = get_the_author_meta('description', $post->post_author);

        return $description;
    }

    public function getDefaultPostData()
    {
        $response = [];
        $response['featured_image'] = $this->getFeaturedImage();
        $response['post_author_image'] = $this->getPostAuthorImage();
        $response['post_author'] = $this->getPostAuthor();
        $response['post_title'] = $this->getPostTitle();
        $response['post_id'] = (string)$this->getPostId();
        $response['post_type'] = $this->getPostType();
        $response['post_excerpt'] = $this->getPostExcerpt();
        $response['wp_blog_logo'] = $this->getBlogLogo();
        $response['post_categories'] = $this->getPostCategories();
        $response['post_tags'] = $this->getPostTags();
        $response['post_comment_count'] = $this->getPostCommentCount();
        $response['post_date'] = $this->getPostDate();
        $response['post_modify_date'] = $this->getPostModifyDate();
        $response['post_parent_name'] = $this->getPostParentName();
        $response['post_author_bio'] = $this->getPostAuthorBio();

        return $response;
    }
}
