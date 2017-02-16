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
class DataAjaxController extends Container implements Module
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

        /** @see \VisualComposer\Modules\Editors\Backend\DataAjaxController::setData */
        $this->wpAddAction('save_post', 'setData');
    }

    /**
     * Save post content and used assets.
     *
     * @param \VisualComposer\Helpers\Filters $filterHelper
     * @param \VisualComposer\Helpers\Request $requestHelper
     *
     * @param $response
     *
     * @param \VisualComposer\Helpers\PostType $postTypeHelper
     *
     * @return array|null
     */
    private function setData($response, $payload, Filters $filterHelper, Request $requestHelper, PostType $postTypeHelper)
    {
        if ($requestHelper->input('vcv-ready') !== '1') {
            return $response;
        }
        $data = $requestHelper->input('vcv-data');
        $sourceId = $requestHelper->input('post_ID');

        if (!is_array($response)) {
            $response = [];
        }
        if (is_numeric($sourceId)) {
            $post = get_post($sourceId);
            if ($post) {
                // In WordPress 4.4 + update_post_meta called if we use
                // $post->meta_input = [ 'vcv:pageContent' => $data ]
                update_post_meta($sourceId, VCV_PREFIX . 'pageContent', $data);

                //bring it back once you're done posting
                add_filter('content_save_pre', 'wp_filter_post_kses');
                add_filter('content_filtered_save_pre', 'wp_filter_post_kses');
                $postTypeHelper->setupPost($sourceId);
                $responseExtra = $filterHelper->fire(
                    'vcv:dataAjax:setData',
                    [
                        'status' => true,
                        'postData' => $postTypeHelper->getPostData(),
                    ],
                    [
                        'sourceId' => $sourceId,
                        'post' => $post,
                        'data' => $data,
                    ]
                );

                return array_merge($response, $responseExtra);
            }
        }
        if (!is_array($response)) {
            $response = [];
        }
        $response['status'] = false;

        return $response;
    }
}
