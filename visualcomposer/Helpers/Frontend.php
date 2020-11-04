<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

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

        if (
            ('post-new.php' === $pagenow && $currentUserAccessHelper->wpAll('edit_posts')->get())
            || ($requestHelper->exists('vcv-source-id')
                && $currentUserAccessHelper->wpAll(
                    ['edit_posts', $requestHelper->input('vcv-source-id')]
                )->get())
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
        $currentUserAccessHelper = vchelper('AccessCurrentUser');

        if ($sourceId && $currentUserAccessHelper->wpAll(['edit_posts', $sourceId])->get()) {
            if (
                $requestHelper->exists('vcv-editable')
                && $requestHelper->exists('vcv-nonce')
                && $nonceHelper->verifyPageEditable($requestHelper->input('vcv-nonce'))
            ) {
                return true;
            }
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
            get_post_type($sourceId)
        );

        $previousDynamicContent = \VcvEnv::get('DYNAMIC_CONTENT_SOURCE_ID');
        \VcvEnv::set('DYNAMIC_CONTENT_SOURCE_ID', $sourceId);
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
        \VcvEnv::set('DYNAMIC_CONTENT_SOURCE_ID', $previousDynamicContent);

        return $sourceContent;
    }

    public function getCurrentBlockId()
    {
        $currentBlockId = \VcvEnv::get('DYNAMIC_CONTENT_SOURCE_ID');
        if (empty($currentBlockId)) {
            $currentBlockId = get_the_ID();
        }

        return $currentBlockId;
    }
}
