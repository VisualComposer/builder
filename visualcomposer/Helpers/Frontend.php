<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;

/**
 * Class Options.
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
        $question = (preg_match('/\?/', $link) ? '&' : '?');
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
        $question = (preg_match('/\?/', $link) ? '&' : '?');
        $query = [
            'vcv-editable' => '1',
            'vcv-source-id' => $sourceId,
            'vcv-nonce' => vchelper('Nonce')->admin(),
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

        if ('post-new.php' === $pagenow && $currentUserAccessHelper->wpAll('edit_posts')->get()
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
            if ($requestHelper->exists('vcv-editable')
                && $requestHelper->exists('vcv-nonce')
                && $nonceHelper->verifyAdmin($requestHelper->input('vcv-nonce'))
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
        if (!$sourceId || get_post_status($sourceId) !== 'publish') {
            return false;
        }

        global $post;
        // @codingStandardsIgnoreStart
        $post = get_post($sourceId);
        setup_postdata($post);
        the_content();
        vcevent('vcv:assets:enqueueAssets', ['sourceIds' => [$sourceId]]);
        wp_reset_postdata();
        // @codingStandardsIgnoreEnd
    }
}
