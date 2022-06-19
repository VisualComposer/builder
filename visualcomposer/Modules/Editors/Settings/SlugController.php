<?php

namespace VisualComposer\Modules\Editors\Settings;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

/**
 * Class SlugController
 * @package VisualComposer\Modules\Editors\Settings
 */
class SlugController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        $this->addFilter('vcv:dataAjax:getData', 'outputSlug');
        $this->addFilter('vcv:dataAjax:setData', 'setPageSlug');
        $this->addFilter('vcv:ajax:settings:parseSlug:adminNonce', 'parseSlug');
    }

    protected function outputSlug($response, $payload)
    {
        global $post;
        // @codingStandardsIgnoreStart
        if ($post->post_name) {
            $postName = $post->post_name;
        } else {
            $postName = wp_unique_post_slug(
                sanitize_title($post->post_title),
                $payload['sourceId'],
                $this->getPostStatus($post),
                $post->post_type,
                $post->post_parent
            );
        }
        $response['permalinkHtml'] = get_sample_permalink_html($payload['sourceId'], $post->post_title, $postName);

        // @codingStandardsIgnoreEnd
        return $response;
    }

    /**
     *  Save the page slug
     *
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\Request $requestHelper
     *
     * @return array
     */
    protected function setPageSlug($response, $payload, Request $requestHelper)
    {
        // Warning! Do not change slug for previewed post.
        // This will break fetching the right revision.
        // @see wp_save_post_revision()
        // Find line: "Grab the last revision, but not an autosave."
        $sourceId = $payload['sourceId'];
        $post = get_post($sourceId);
        $postName = $requestHelper->input('vcv-post-name');
        $postTitle = $requestHelper->input('vcv-page-title');
        $slug = $postName ? $postName : $postTitle;
        if (is_object($post)) {
            if (
                // @codingStandardsIgnoreLine
                !$post->post_name
                // @codingStandardsIgnoreLine
                || ($postName !== $post->post_name && get_option('permalink_structure'))
            ) {
                $postName = wp_unique_post_slug(
                    sanitize_title($slug),
                    $sourceId,
                    $this->getPostStatus($post),
                    // @codingStandardsIgnoreLine
                    $post->post_type,
                    // @codingStandardsIgnoreLine
                    $post->post_parent
                );
                // Update post name
                // @codingStandardsIgnoreLine
                $post->post_name = $postName;
                $response['permalinkHtml'] = get_sample_permalink_html($sourceId, $postTitle, $postName);

                $nonce = wp_create_nonce('post_preview_' . $sourceId);
                $previewUrl = get_preview_post_link($post, ['preview_id' => $sourceId, 'preview_nonce' => $nonce]);
                $response['permalinkHtml'] = get_sample_permalink_html($sourceId, $postTitle, $postName);

                wp_update_post($post);
            }
        }

        return $response;
    }

    /**
     *  Parse/Validate slug
     *
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\Request $requestHelper
     *
     * @return array|bool
     */
    protected function parseSlug($response, $payload, Request $requestHelper)
    {
        if (!is_array($response)) {
            $response = [];
        }
        $sourceId = $requestHelper->input('vcv-source-id');
        $post = get_post($sourceId);
        $postName = $requestHelper->input('vcv-post-name');
        $postTitle = $requestHelper->input('vcv-page-title');
        $slug = $postName ? $postName : $postTitle;
        if (is_object($post) && get_option('permalink_structure')) {
            // @codingStandardsIgnoreStart
            $postName = $post->post_name = wp_unique_post_slug(
                sanitize_title($slug),
                $sourceId,
                $this->getPostStatus($post),
                $post->post_type,
                $post->post_parent
            );
            // @codingStandardsIgnoreEnd
            $response['permalinkHtml'] = get_sample_permalink_html($sourceId, $postTitle, $postName);
        } else {
            return false;
        }

        return $response;
    }

    /**
     * Fake post publish, for clean link
     *
     * @param $post
     *
     * @return string
     */
    protected function getPostStatus($post)
    {
        // @codingStandardsIgnoreStart
        if (in_array($post->post_status, ['draft', 'auto-draft', 'pending', 'future'])) {
            $postStatus = 'publish';
        } else {
            // @codingStandardsIgnoreStart
            $postStatus = $post->post_status;
        }

        return $postStatus;
    }
}
