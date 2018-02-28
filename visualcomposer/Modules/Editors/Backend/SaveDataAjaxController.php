<?php

namespace VisualComposer\Modules\Editors\Backend;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use WP_Post;

/**
 * Class Controller.
 */
class SaveDataAjaxController extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    public function __construct()
    {
        if (vcvenv('VCV_TF_DISABLE_BE')) {
            return;
        }

        add_filter('wp_insert_post_empty_content', '__return_false');
        /** @see \VisualComposer\Modules\Editors\Backend\SaveDataAjaxController::setData */
        $this->wpAddAction('save_post', 'setData');
    }

    /**
     * Save post content and used assets.
     *
     * @param \VisualComposer\Helpers\Request $requestHelper
     *
     * @return array|null
     */
    protected function setData(Request $requestHelper)
    {
        if ($requestHelper->input('vcv-backend') !== '1') {
            return null;
        }
        $sourceId = $requestHelper->input('post_ID');
        if (is_numeric($sourceId)) {
            $post = get_post($sourceId);
            $data = $requestHelper->input('vcv-data');
            if ($post) {
                return $this->getSourceResponse($post, $data);
            }
        }

        return null;
    }

    protected function getSourceResponse(WP_Post $post, $data)
    {
        $postTypeHelper = vchelper('PostType');
        $requestHelper = vchelper('Request');
        //@codingStandardsIgnoreLine
        if ($requestHelper->input('wp-preview', '') !== 'dopreview' || 'publish' !== $post->post_status) {
            // In WordPress 4.4 + update_post_meta called if we use
            // $post->meta_input = [ 'vcv:pageContent' => $data ]
            update_post_meta($post->ID, VCV_PREFIX . 'pageContent', $data);
        }

        //bring it back once you're done posting
        add_filter('content_save_pre', 'wp_filter_post_kses');
        add_filter('content_filtered_save_pre', 'wp_filter_post_kses');
        $postTypeHelper->setupPost($post->ID);
        $responseExtra = vcfilter(
            'vcv:dataAjax:setData',
            [
                'status' => true,
                'postData' => $postTypeHelper->getPostData(),
            ],
            [
                'sourceId' => $post->ID,
                'post' => $post,
                'data' => $data,
            ]
        );

        return $responseExtra;
    }
}
