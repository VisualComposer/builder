<?php

namespace VisualComposer\Modules\Editors\DataAjax;

use VisualComposer\Helpers\Filters;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Options;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Traits\EventsFilters;

/**
 * Class Controller.
 */
class Controller extends Container implements Module
{
    use EventsFilters;

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
     * @param $response
     *
     * @return mixed|string
     */
    private function getData(Request $requestHelper, $response)
    {
        $data = '';
        $sourceId = $requestHelper->input('vcv-source-id');
        if (is_numeric($sourceId)) {
            // TODO: fix react components if there is empty page content.
            $postMeta = get_post_meta($sourceId, VCV_PREFIX . 'pageContent', true);
            if (!empty($postMeta)) {
                $data = $postMeta;
                /* !empty($postMeta) ? $postMeta : get_post($sourceId)->post_content; */
            }
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
     * @return array|null
     */
    private function setData(Filters $filterHelper, Request $requestHelper)
    {
        $data = $requestHelper->input('vcv-data');
        $content = $requestHelper->input('vcv-content');
        $sourceId = $requestHelper->input('vcv-source-id');
        if (is_numeric($sourceId)) {
            $post = get_post($sourceId);
            if ($post) {
                $post->post_content = $content;
                if (isset($data['draft']) && $post->post_status !== 'publish') {
                    $post->post_status = 'draft';
                } else {
                    $post->post_status = 'publish';
                }
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
                /** @var \VisualComposer\Modules\Editors\Frontend\Controller $frontendModule */
                $frontendModule = vcapp('EditorsFrontendController');
                $frontendModule->setupPost($sourceId);
                $response = $filterHelper->fire(
                    'vcv:postAjax:setPostData',
                    [
                        'status' => true,
                        'postData' => $frontendModule->getPostData(),
                    ],
                    [
                        'sourceId' => $sourceId,
                        'post' => $post,
                        'data' => $data,
                    ]
                );

                return $response;
            }
        }

        return [
            'status' => false,
        ];
    }
}
