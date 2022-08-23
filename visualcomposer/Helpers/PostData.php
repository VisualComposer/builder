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
        $imageAttributes = [];
        // @codingStandardsIgnoreLine
        if (isset($post) && $post->post_status !== 'trash' && !empty($postThumbnailUrlDb)) {
            $postThumbnailUrl = $postThumbnailUrlDb;
            $imageAttributes = $this->getImageAttributes($sourceId);
        }

        $dynamicFields['vcv-dynamic-field'] = 'featured_image';
        $dynamicFields = array_merge($dynamicFields, $imageAttributes);

        return $urlHelper->query($postThumbnailUrl, $dynamicFields);
    }

    public function getImageAttributes($sourceId = '')
    {
        $post = get_post($sourceId);
        $postThumbnailUrlDb = get_the_post_thumbnail_url($post->ID, 'full');
        $imageAttributes = [];
        // @codingStandardsIgnoreLine
        if (isset($post) && $post->post_status !== 'trash' && !empty($postThumbnailUrlDb)) {
            $imageId = get_post_thumbnail_id($sourceId);
            $attachment = get_post($imageId);
            //@codingStandardsIgnoreStart
            $imageAttributes = [
                'alt' => get_post_meta($attachment->ID, '_wp_attachment_image_alt', true),
                'caption' => $attachment->post_excerpt,
                'title' => $attachment->post_title,
            ];
            //@codingStandardsIgnoreEnd
        }

        return $imageAttributes;
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

        // @codingStandardsIgnoreLine
        if ($post->post_title === __('Auto Draft')) {
            // @codingStandardsIgnoreLine
            $post->post_title = sprintf('%s #%s', __('Visual Composer', 'visualcomposer'), $post->ID);
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

    public function getPostTypeSlug($sourceId = '')
    {
        $post = get_post($sourceId);
        // @codingStandardsIgnoreLine
        if (!isset($post) || $post->post_status === 'trash') {
            return false;
        }
        // @codingStandardsIgnoreLine
        return $post->post_type;
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

    public function getPostCategories($sourceId = '', $payload = [])
    {
        $post = get_post($sourceId);
        // @codingStandardsIgnoreLine
        if (!isset($post) || $post->post_status === 'trash') {
            return false;
        }

        $separator = empty($payload['atts']['separator']) ? ', ' : $payload['atts']['separator'] . ' ';
        $categoriesList = get_the_category_list($separator, '', $sourceId);

        return $categoriesList;
    }

    public function getPostTags($sourceId = '', $payload = [])
    {
        $post = get_post($sourceId);
        // @codingStandardsIgnoreLine
        if (!isset($post) || $post->post_status === 'trash') {
            return false;
        }

        $separator = empty($payload['atts']['separator']) ? ', ' : $payload['atts']['separator'] . ' ';
        $tagsList = get_the_term_list($sourceId, 'post_tag', '', $separator, '');

        return $tagsList;
    }

    public function getPostCategoriesList($sourceId = '')
    {
        $post = get_post($sourceId);
        // @codingStandardsIgnoreLine
        if (!isset($post) || $post->post_status === 'trash') {
            return [];
        }
        if (get_post_type($sourceId) !== 'post') {
            return [];
        }
        $categories = apply_filters('the_category_list', get_the_category($sourceId), $sourceId);
        // Default category
        $categoriesList = [
            '<a href="#">' . __('Uncategorized') . '</a>',
        ];

        if (!empty($categories)) {
            $categoriesList = [];
            foreach ($categories as $category) {
                // phpcs:ignore
                $categoriesList[] = '<a href="' . esc_url(get_category_link($category->term_id)) . '"  rel="category">' . $category->name . '</a>';
            }
        }

        return $categoriesList;
    }

    public function getPostTagsList($sourceId = '')
    {
        $post = get_post($sourceId);
        // @codingStandardsIgnoreLine
        if (!isset($post) || $post->post_status === 'trash') {
            return false;
        }

        if (get_post_type($sourceId) !== 'post') {
            return [];
        }
        $tags = apply_filters('the_tags_list', get_the_tags($sourceId), $sourceId);

        // Default
        $tagsList = [];
        if (is_admin()) {
            $tagsList = [
                __("This post type doesn't have tags", 'visualcomposer'),
            ];
        }

        if (!empty($tags)) {
            $tagsList = [];
            foreach ($tags as $tag) {
                // phpcs:ignore
                $tagsList[] = '<a href="' . esc_url(get_term_link($tag->term_id, 'post_tag')) . '"  rel="tag">' . $tag->name . '</a>';
            }
        }

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

    public function getPostAuthorLink($sourceId = '')
    {
        $post = get_post($sourceId);
        // @codingStandardsIgnoreLine
        if (!isset($post) || $post->post_status === 'trash') {
            return false;
        }

        // @codingStandardsIgnoreLine
        $authorName = get_the_author_meta('display_name', $post->post_author);
        $actualValue = sprintf(
            '<a href="%1$s" rel="author">%2$s</a>',
            // @codingStandardsIgnoreLine
            esc_url(get_author_posts_url($post->post_author)),
            $authorName
        );

        return $actualValue;
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
        $date = gmdate('Y');

        return $date;
    }

    public function getPostUrl($sourceId = '')
    {
        $url = get_permalink($sourceId);

        return $url;
    }

    public function getCommentUrl($sourceId = '')
    {
        $url = get_comments_link($sourceId);

        return $url;
    }

    public function getDefaultPostData($sourceId = '')
    {
        $response = [];
        $response['featured_image'] = $this->replaceSpacerWithPlaceholder($sourceId);
        $response['post_author_image'] = $this->getPostAuthorImage($sourceId);
        $response['post_author'] = $this->getPostAuthor($sourceId);
        $response['post_title'] = $this->getPostTitle($sourceId);
        $response['post_id'] = (string)$this->getPostId($sourceId);
        $response['post_type'] = $this->getPostType($sourceId);
        $response['post_type_slug'] = get_post_type($sourceId);
        $response['post_excerpt'] = $this->getPostExcerpt($sourceId);
        $response['wp_blog_logo'] = $this->getBlogLogo();
        $response['post_tags'] = $this->getPostTags($sourceId);
        $response['post_categories'] = $this->getPostCategories($sourceId);
        $response['post_comment_count'] = $this->getPostCommentCount($sourceId);
        $response['post_date'] = $this->getPostDate($sourceId);
        $response['post_modify_date'] = $this->getPostModifyDate($sourceId);
        $response['post_parent_name'] = $this->getPostParentName($sourceId);
        $response['post_author_bio'] = $this->getPostAuthorBio($sourceId);
        $response['post_author_link'] = $this->getPostAuthorLink($sourceId);
        $response['site_title'] = $this->getSiteTitle();
        $response['site_tagline'] = $this->getSiteTagline();
        $response['site_url'] = $this->getSiteUrl();
        $response['current_year'] = $this->getCurrentYear();
        $response['post_url'] = $this->getPostUrl($sourceId);
        $response['comment_url'] = $this->getCommentUrl($sourceId);

        return $response;
    }

    /**
     * Replace image spacer with image placeholder.
     *
     * @param integer $sourceId
     *
     * @return string
     */
    public function replaceSpacerWithPlaceholder($sourceId)
    {
        return str_replace(
            'images/spacer.png',
            'images/' . $this->getEditorImagePlaceholder()['name'],
            $this->getFeaturedImage($sourceId)
        );
    }

    /**
     * Get placeholder for an editor images.
     *
     * @return array
     */
    public function getEditorImagePlaceholder()
    {
        $name = 'featured-image-preview.png';
        return [
            'name' => $name,
            'path' => vcapp()->path('visualcomposer/resources/images/' . $name),
            'url' => VCV_PLUGIN_URL . '/visualcomposer/resources/images/' . $name,
        ];
    }
}
