<?php

namespace VisualComposer\Helpers;

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

        $link = get_edit_post_link($post);
        $question = (preg_match('/\?/', $link) ? '&' : '?');
        $query = [
            'vcv-action' => 'frontend',
            'vcv-source-id' => $post->ID,
        ];
        $frontendUrl = $link . $question . http_build_query($query);

        return $frontendUrl;
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
            'vcv-nonce' => vchelper('Nonce')->admin(),
        ];

        $editableUrl = $link . $question . http_build_query($query);

        return $editableUrl;
    }

    public function isFrontend()
    {
        $requestHelper = vchelper('Request');
        if (is_admin() && $requestHelper->exists('vcv-action')) {
            $requestAction = $requestHelper->input('vcv-action');
            if ($requestAction === 'frontend') {
                return true;
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

        return (
            $requestHelper->exists('vcv-editable')
            && $requestHelper->exists('vcv-nonce')
            && $nonceHelper->verifyAdmin($requestHelper->input('vcv-nonce'))
        );
    }
}
