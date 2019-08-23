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
    public function getFeaturedImage($sourceId = '')
    {
        $post = get_post($sourceId);
        $urlHelper = vchelper('Url');
        $postThumbnailUrl = $urlHelper->assetUrl('images/spacer.png');
        $postThumbnailUrlDb = get_the_post_thumbnail_url($post->ID, 'full');
        // @codingStandardsIgnoreLine
        if (isset($post) && $post->post_status !== 'trash' && !empty($postThumbnailUrlDb)) {
            $postThumbnailUrl = $postThumbnailUrlDb;
        }

        return $urlHelper->query(
            $postThumbnailUrl,
            [
                'vcv-dynamic-field' => 'featured_image',
            ]
        );
    }

    public function getPostAuthorImage($sourceId = '')
    {
        $post = get_post($sourceId);
        $urlHelper = vchelper('Url');
        $url = $urlHelper->assetUrl('images/spacer.png');
        // @codingStandardsIgnoreLine
        if (isset($post) && $post->post_status !== 'trash') {
            // @codingStandardsIgnoreLine
            $avatarData = get_avatar_data($post->post_author);
            if (isset($avatarData['url']) && !empty($avatarData['url'])) {
                $url = $avatarData['url'];
            }
        }

        return $urlHelper->query(
            $url,
            [
                'vcv-dynamic-field' => 'post_author_image',
            ]
        );
    }

    public function getPostAuthor($sourceId = '')
    {
        $post = get_post($sourceId);
        // @codingStandardsIgnoreLine
        if (!isset($post) || $post->post_status === 'trash') {
            return false;
        }

        // @codingStandardsIgnoreLine
        return get_the_author_meta('display_name', $post->post_author);
    }

    public function getPostTitle($sourceId = '')
    {
        $post = get_post($sourceId);
        // @codingStandardsIgnoreLine
        if (!isset($post) || $post->post_status === 'trash') {
            return false;
        }

        //@codingStandardsIgnoreLine
        return $post->post_title;
    }

    public function getPostId($sourceId = '')
    {
        $post = get_post($sourceId);
        // @codingStandardsIgnoreLine
        if (!isset($post) || $post->post_status === 'trash') {
            return false;
        }

        return $post->ID;
    }

    public function getPostExcerpt($sourceId = '')
    {
        $post = get_post($sourceId);
        // @codingStandardsIgnoreLine
        if (!isset($post) || $post->post_status === 'trash') {
            return false;
        }

        //@codingStandardsIgnoreLine
        return $post->post_excerpt;
    }

    public function getPostType($sourceId = '')
    {
        $post = get_post($sourceId);
        // @codingStandardsIgnoreLine
        if (!isset($post) || $post->post_status === 'trash') {
            return false;
        }

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

    public function getPostCategories($sourceId = '')
    {
        $post = get_post($sourceId);
        // @codingStandardsIgnoreLine
        if (!isset($post) || $post->post_status === 'trash') {
            return false;
        }

        $categoriesList = get_the_category_list(', ', '', $sourceId);

        return $categoriesList;
    }

    public function getPostTags($sourceId = '')
    {
        $post = get_post($sourceId);
        // @codingStandardsIgnoreLine
        if (!isset($post) || $post->post_status === 'trash') {
            return false;
        }

        $tagsList = get_the_term_list($sourceId, 'post_tag', '', ', ', '');

        return $tagsList;
    }

    public function getPostCommentCount($sourceId = '')
    {
        $post = get_post($sourceId);
        // @codingStandardsIgnoreLine
        if (!isset($post) || $post->post_status === 'trash') {
            return false;
        }
        $commentCount = get_comments_number($post->ID);

        return $commentCount;
    }

    public function getPostDate($sourceId = '')
    {
        $post = get_post($sourceId);
        // @codingStandardsIgnoreLine
        if (!isset($post) || $post->post_status === 'trash') {
            return false;
        }

        $date = get_the_date('', $sourceId);

        return $date;
    }

    public function getPostModifyDate($sourceId = '')
    {
        $post = get_post($sourceId);
        // @codingStandardsIgnoreLine
        if (!isset($post) || $post->post_status === 'trash') {
            return false;
        }

        $date = get_the_modified_date('', $sourceId);

        return $date;
    }

    public function getPostParentName($sourceId = '')
    {
        $post = get_post($sourceId);
        // @codingStandardsIgnoreLine
        if (!isset($post) || $post->post_status === 'trash') {
            return false;
        }
        $parentId = wp_get_post_parent_id($post);

        if ($parentId) {
            $parentPost = get_post($parentId);

            //@codingStandardsIgnoreLine
            return $parentPost->post_title;
        }

        return false;
    }

    public function getPostAuthorBio($sourceId = '')
    {
        $post = get_post($sourceId);
        if (!isset($post)) {
            return false;
        }
        //@codingStandardsIgnoreLine
        $description = get_the_author_meta('description', $post->post_author);

        return $description;
    }

    public function getSiteTitle()
    {
        $name = get_bloginfo('name');

        return $name;
    }

    public function getSiteTagline()
    {
        $tagline = get_bloginfo('description');

        return $tagline;
    }

    public function getSiteUrl()
    {
        $url = get_bloginfo('url');

        return $url;
    }

    public function getCurrentYear()
    {
        $date = date('Y');

        return $date;
    }

    public function getDefaultPostData($sourceId = '')
    {
        $response = [];
        $response['featured_image'] = $this->getFeaturedImage($sourceId);
        $response['post_author_image'] = $this->getPostAuthorImage($sourceId);
        $response['post_author'] = $this->getPostAuthor($sourceId);
        $response['post_title'] = $this->getPostTitle($sourceId);
        $response['post_id'] = (string)$this->getPostId($sourceId);
        $response['post_type'] = $this->getPostType($sourceId);
        $response['post_excerpt'] = $this->getPostExcerpt($sourceId);
        $response['wp_blog_logo'] = $this->getBlogLogo($sourceId);
        $response['post_categories'] = $this->getPostCategories($sourceId);
        $response['post_tags'] = $this->getPostTags($sourceId);
        $response['post_comment_count'] = $this->getPostCommentCount($sourceId);
        $response['post_date'] = $this->getPostDate($sourceId);
        $response['post_modify_date'] = $this->getPostModifyDate($sourceId);
        $response['post_parent_name'] = $this->getPostParentName($sourceId);
        $response['post_author_bio'] = $this->getPostAuthorBio($sourceId);
        $response['site_title'] = $this->getSiteTitle($sourceId);
        $response['site_tagline'] = $this->getSiteTagline($sourceId);
        $response['site_url'] = $this->getSiteUrl($sourceId);
        $response['current_year'] = $this->getCurrentYear($sourceId);

        return $response;
    }
}
