<?php

namespace VisualComposer\Modules\Editors\Backend;

use VisualComposer\Helpers\Filters;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\PostType;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Options;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Class Controller.
 */
class SaveDataAjaxController extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    /**
     * @var \VisualComposer\Helpers\Options
     */
    protected $options;

    public function __construct(Options $optionsHelper)
    {
        $this->options = $optionsHelper;

        add_filter('wp_insert_post_empty_content', '__return_false');
        /** @see \VisualComposer\Modules\Editors\Backend\SaveDataAjaxController::setData */
        $this->wpAddAction('save_post', 'setData');
    }

    /**
     * Save post content and used assets.
     *
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param $response
     * @param $payload
     *
     * @return array|null
     */
    protected function setData(
        $response,
        $payload,
        Request $requestHelper
    ) {
        if ($requestHelper->input('vcv-ready') !== '1') {
            return $response;
        }
        $sourceId = $requestHelper->input('post_ID');

        if (!is_array($response)) {
            $response = [];
        }
        if (is_numeric($sourceId)) {
            $post = get_post($sourceId);
            $data = $requestHelper->input('vcv-data');
            if ($post) {
                return array_merge($response, $this->getSourceResponse($post, $data));
            }
        }
        if (!is_array($response)) {
            $response = [];
        }
        $response['status'] = false;

        return $response;
    }

    protected function getSourceResponse(\WP_Post $post, $data)
    {
        $postTypeHelper = vchelper('PostType');
        // In WordPress 4.4 + update_post_meta called if we use
        // $post->meta_input = [ 'vcv:pageContent' => $data ]
        update_post_meta($post->ID, VCV_PREFIX . 'pageContent', $data);

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
