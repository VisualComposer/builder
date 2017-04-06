<?php

namespace VisualComposer\Modules\Editors\DataAjax;

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
class Controller extends Container implements Module
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
        /** @see \VisualComposer\Modules\Editors\DataAjax\Controller::getData */
        $this->addFilter(
            'vcv:ajax:getData:adminNonce',
            'getData'
        );

        /** @see \VisualComposer\Modules\Editors\DataAjax\Controller::setData */
        $this->addFilter(
            'vcv:ajax:setData:adminNonce',
            'setData'
        );
    }

    /**
     * Get post content.
     *
     * @param \VisualComposer\Helpers\Request $requestHelper
     *
     * @param \VisualComposer\Helpers\Filters $filterHelper
     * @param $response
     *
     * @return mixed|string
     */
    private function getData(Request $requestHelper, Filters $filterHelper, $response)
    {
        $data = '';
        $sourceId = $requestHelper->input('vcv-source-id');
        if (!is_array($response)) {
            $response = [];
        }
        if (is_numeric($sourceId)) {
            // TODO: fix react components if there is empty page content.
            $postMeta = get_post_meta($sourceId, VCV_PREFIX . 'pageContent', true);
            if (!empty($postMeta)) {
                $data = $postMeta;
                /* !empty($postMeta) ? $postMeta : get_post($sourceId)->post_content; */
            }
            $responseExtra = $filterHelper->fire(
                'vcv:dataAjax:getData',
                [
                    'status' => true,
                ],
                [
                    'sourceId' => $sourceId,
                ]
            );
            $response = array_merge($response, $responseExtra);
        }
        $response['data'] = $data;

        return $response;
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
    private function setData(
        $response,
        $payload,
        Filters $filterHelper,
        Request $requestHelper,
        PostType $postTypeHelper
    ) {
        if ($requestHelper->input('vcv-ready') !== '1') {
            return $response;
        }
        $data = $requestHelper->input('vcv-data');
        $content = $requestHelper->input('vcv-content');
        $sourceId = $requestHelper->input('vcv-source-id');

        if (!is_array($response)) {
            $response = [];
        }
        if (is_numeric($sourceId)) {
            $sourceId = (int)$sourceId;
            $post = get_post($sourceId);
            if ($post) {
                // @codingStandardsIgnoreStart
                $post->post_content = $content;
                if (isset($data['draft']) && $post->post_status !== 'publish') {
                    $post->post_status = 'draft';
                } else {
                    $post->post_status = 'publish';
                }
                // @codingStandardsIgnoreEnd
                //temporarily disable
                remove_filter('content_save_pre', 'wp_filter_post_kses');
                remove_filter('content_filtered_save_pre', 'wp_filter_post_kses');
                wp_update_post($post);
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
