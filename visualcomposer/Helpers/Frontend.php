<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VcvEnv;
use VisualComposer\Framework\Illuminate\Support\Helper;

/**
 * Class Frontend.
 */
class Frontend implements Helper
{
    /**
     * @param $sourceId
     *
     * @return string
     */
    public function getFrontendUrl($sourceId = 0)
    {
        if (!$post = get_post($sourceId)) {
            return '';
        }

        $link = get_edit_post_link($post, 'url');
        $question = (false !== strpos($link, '?') ? '&' : '?');
        $query = [
            'vcv-action' => 'frontend',
            'vcv-source-id' => $post->ID,
        ];
        $frontendUrl = $link . $question . http_build_query($query, '', '&');
        $frontendUrl = str_replace('?&', '?', $frontendUrl);

        return vcfilter('vcv:frontend:url', $frontendUrl, ['sourceId' => $sourceId, 'query' => $query]);
    }

    /**
     * @param $sourceId
     *
     * @return string
     */
    public function getEditableUrl($sourceId)
    {
        $link = set_url_scheme(get_permalink($sourceId), 'admin');
        $question = (false !== strpos($link, '?') ? '&' : '?');
        $query = [
            'vcv-editable' => '1',
            'vcv-source-id' => $sourceId,
            'vcv-nonce' => vchelper('Nonce')->pageEditable(),
        ];

        $editableUrl = $link . $question . http_build_query($query, '', '&');
        $editableUrl = str_replace('?&', '?', $editableUrl);

        return vcfilter('vcv:frontend:pageEditable:url', $editableUrl, ['sourceId' => $sourceId, 'query' => $query]);
    }

    /**
     * @return bool
     */
    public function isFrontend()
    {
        global $pagenow;
        $requestHelper = vchelper('Request');
        $currentUserAccessHelper = vchelper('AccessCurrentUser');
        $postType = $requestHelper->input('post_type');
        if (!$requestHelper->exists('post_type') || empty($postType)) {
            $postType = 'post';
        } elseif (in_array($postType, get_post_types(['show_ui' => true]), true)) {
            $postType = esc_attr($postType);
        } else {
            return false; // wrong or not post type at all (like index.php)
        }
        $postTypeObject = get_post_type_object($postType);

        if (!$postTypeObject) {
            return false;
        }

        if (
            (
                'post-new.php' === $pagenow && $currentUserAccessHelper->wpAll($postTypeObject->cap->edit_posts)->get()
            )
            || (
                $requestHelper->exists('vcv-source-id')
                && $currentUserAccessHelper->wpAll(
                    ['edit_post', $requestHelper->input('vcv-source-id')]
                )->get()
            )
        ) {
            if (is_admin() && $requestHelper->exists('vcv-action')) {
                return $requestHelper->input('vcv-action') === 'frontend';
            }
        }

        return false;
    }

    /**
     * @return bool
     */
    public function isPageEditable()
    {
        $requestHelper = vchelper('Request');
        $nonceHelper = vchelper('Nonce');
        $sourceId = vchelper('Request')->input('vcv-source-id');

        if (
            $sourceId
            && $requestHelper->exists('vcv-editable')
            && $requestHelper->exists('vcv-nonce')
            && $nonceHelper->verifyPageEditable($requestHelper->input('vcv-nonce'))
        ) {
            return true;
        }

        return false;
    }

    public function isPreview()
    {
        $requestHelper = vchelper('Request');

        return $requestHelper->input('preview', '') === 'true'
            || ($requestHelper->exists('wp-preview')
                && $requestHelper->input('wp-preview') === 'dopreview');
    }

    /**
     * Check if current frontend page has vcv implementation.
     *
     * The page pass for vcv when it's editable with our editor or overridden by our theme builder layout.
     * And has at least one vcv element on it.
     * In case it is an archive, at least one of the posts in the archive was editable with vcv editor.
     * Any page that has popup we consider as vcv page too.
     *
     * @return bool
     */
    public function isVcvFrontend()
    {
        $isVcvFrontend = true;
        if ($this->isPageEditable()) {
            return true;
        }

        if (is_singular()) {
            if (!$this->isVcvPost(get_the_ID())) {
                $isVcvFrontend = false;
            }
        } else {
            // @codingStandardsIgnoreLine
            global $wp_query;
            // @codingStandardsIgnoreLine
            $postList = empty($wp_query->posts) ? [] : $wp_query->posts;
            foreach ($postList as $post) {
                // if at least one post is vcv post then current archive page considerable as vcv page.
                if ($this->isVcvPost($post->ID)) {
                    $isVcvFrontend = true;
                    break;
                }

                $isVcvFrontend = false;
            }
        }

        return vcfilter('vcv:helpers:frontend:isVcvFrontend', $isVcvFrontend);
    }

    /**
     * Check if post is Vcv post.
     *
     * The post pass for vcv when it's editable with our editor.
     * And has at least one vcv element on it.
     *
     * @param $postId
     *
     * @return bool
     */
    public function isVcvPost($postId)
    {
        $isVcvPost = true;
        $content = get_post_meta($postId, VCV_PREFIX . 'pageContent', true);
        // post is not editable with vcv editor
        if (empty($content)) {
            $isVcvPost = false;
        }
        $decoded = json_decode(rawurldecode($content), true);
        if (empty($decoded['elements'])) {
            // post don't have any vcv elements
            $isVcvPost = false;
        }

        return $isVcvPost;
    }

    public function renderContent($sourceId)
    {
        // @codingStandardsIgnoreLine
        global $wp_version;

        if (!$sourceId || get_post_status($sourceId) !== 'publish') {
            return false;
        }
        $sourceId = apply_filters(
            'wpml_object_id',
            $sourceId,
            get_post_type($sourceId),
            true
        );
        vcevent('vcv:frontend:renderContent', $sourceId); // Used in Reset check

        $previousDynamicContent = VcvEnv::get('DYNAMIC_CONTENT_SOURCE_ID');
        VcvEnv::set('DYNAMIC_CONTENT_SOURCE_ID', $sourceId);
        vchelper('AssetsEnqueue')->addToEnqueueList($sourceId);

        // @codingStandardsIgnoreLine
        if (version_compare($wp_version, '5.2', '>=')) {
            $sourceContent = get_the_content('', false, $sourceId);
        } else {
            $post = get_post($sourceId);
            setup_postdata($post);
            $sourceContent = get_the_content('', false);
            wp_reset_postdata();
        }
        if (strpos($sourceContent, '<!--vcv no format-->') === false) {
            // Call wpautop for non VCWB sourceId
            $sourceContent = wpautop($sourceContent);
        }
        // Call the_content filter callbacks separately
        if (function_exists('do_blocks')) {
            $sourceContent = do_blocks($sourceContent);
        }
        $sourceContent = shortcode_unautop($sourceContent);
        $sourceContent = prepend_attachment($sourceContent);
        if (function_exists('wp_filter_content_tags')) {
            $sourceContent = wp_filter_content_tags($sourceContent);
        } else {
            // @deprecated since WordPress 5.5
            $sourceContent = wp_make_content_images_responsive($sourceContent);
        }
        $sourceContent = do_shortcode($sourceContent);
        $sourceContent = convert_smilies($sourceContent);
        $sourceContent = str_replace(
            '<!--vcv no format-->',
            '',
            $sourceContent
        );
        $sourceContent = vcfilter('vcv:frontend:content', $sourceContent);
        VcvEnv::set('DYNAMIC_CONTENT_SOURCE_ID', $previousDynamicContent);

        return $sourceContent;
    }

    public function getCurrentBlockId()
    {
        $currentBlockId = VcvEnv::get('DYNAMIC_CONTENT_SOURCE_ID');
        if (empty($currentBlockId)) {
            $currentBlockId = get_the_ID();
        }

        return $currentBlockId;
    }
}
