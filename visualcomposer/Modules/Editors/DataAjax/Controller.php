<?php

namespace VisualComposer\Modules\Editors\DataAjax;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Helpers\Access\UserCapabilities;
use VisualComposer\Helpers\Filters;
use VisualComposer\Framework\Illuminate\Support\Module;
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
     * @param $response
     * @param \VisualComposer\Helpers\Filters $filterHelper
     *
     * @return mixed|string
     */
    private function getData(
        $response,
        $payload,
        Filters $filterHelper
    ) {
        global $post;
        if (empty($post)) {
            return ['status' => false];
        }
        $sourceId = $post->ID;
        if (!is_array($response)) {
            $response = [];
        }
        $data = '';
        if ($post) {
            // @codingStandardsIgnoreLine
            $postMeta = get_post_meta($sourceId, VCV_PREFIX . 'pageContent', true);
            if (!empty($postMeta)) {
                $data = $postMeta;
            } else {
                // BC for hub templates and old templates
                // @codingStandardsIgnoreLine
                if ($post->post_type === 'vcv_templates' || $post->post_type === 'vcv_tutorials') {
                    $data = rawurlencode(
                        wp_json_encode(
                            [
                                'elements' => get_post_meta($sourceId, 'vcvEditorTemplateElements', true),
                            ]
                        )
                    );
                }
            }
            // @codingStandardsIgnoreLine
            $response['post_content'] = $post->post_content;
            $responseExtra = $filterHelper->fire(
                'vcv:dataAjax:getData',
                [
                    'status' => true,
                ],
                $payload
            );
            $response = array_merge($response, $responseExtra);
        }
        $response['data'] = $data;

        $elementsCssData = get_post_meta($sourceId, VCV_PREFIX . 'globalElementsCssData', true);
        $response['elementsCssData'] = $elementsCssData;


        return $response;
    }

    /**
     * Save post content and used assets.
     *
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\Request $requestHelper
     * @param \VisualComposer\Helpers\Access\UserCapabilities $userCapabilitiesHelper
     *
     * @return array|null
     */
    private function setData(
        $response,
        $payload,
        Request $requestHelper,
        UserCapabilities $userCapabilitiesHelper
    ) {
        if (!isset($payload['sourceId'])) {
            return ['status' => false]; // sourceId must be provided
        }
        $sourceId = $payload['sourceId'];
        if (!is_numeric($sourceId)) {
            $sourceId = vcfilter('vcv:dataAjax:setData:sourceId', $sourceId);
        }
        if ($requestHelper->input('vcv-ready') !== '1') {
            return $response;
        }

        if (!is_array($response)) {
            $response = [];
        }

        if (is_numeric($sourceId) && $userCapabilitiesHelper->canEdit($sourceId)) {
            $sourceId = (int)$sourceId;
            $post = get_post($sourceId);
            if ($post) {
                if ($requestHelper->input('vcv-updatePost') === '1') {
                    vchelper('Events')->fire('vcv:hub:removePostUpdate:post/' . $sourceId, $sourceId, $payload);
                }

                return $this->updatePostData($post, $sourceId, $response);
            }
        }
        if (!is_array($response)) {
            $response = [];
        }
        $response['status'] = false;

        return $response;
    }

    protected function createPreviewPost($post, $sourceId)
    {
        $previewPosts = get_posts(
            [
                'post_parent' => $sourceId,
                'author' => $post->author,
                'post_status' => 'inherit',
                'post_type' => 'revision',
                'orderby' => 'ID',
                'order' => 'DESC',
            ]
        );
        $previewPost = [];
        // @codingStandardsIgnoreLine
        if (in_array($post->post_status, ['publish', 'future', 'private'])) {
            $previewPost[0]['post_name'] = $post->ID . '-autosave-v1';
        } else {
            $previewPost[0]['post_name'] = $post->ID . '-revision-v1';
        }
        // @codingStandardsIgnoreLine
        $previewPost[0]['post_content'] = $post->post_content;
        $previewPost[0]['post_status'] = 'inherit';
        $previewPost[0]['post_type'] = 'revision';
        $previewPost[0]['comment_status'] = 'closed';
        $previewPost[0]['ping_status'] = 'closed';
        $previewPost[0]['author'] = $post->author;
        $previewPost[0]['post_parent'] = $post->ID;

        if ($previewPosts) {
            $previewPost[0]['ID'] = $previewPosts[0]->ID;
        } else {
            $previewPost[0]['ID'] = null;
        }

        return $previewPost;
    }

    protected function updatePostData($post, $sourceId, $response)
    {
        ob_start();
        $filterHelper = vchelper('Filters');
        $postTypeHelper = vchelper('PostType');
        $currentUserAccessHelper = vchelper('AccessCurrentUser');
        $requestHelper = vchelper('Request');
        $assetsHelper = vchelper('Assets');
        $optionsHelper = vchelper('Options');

        $data = $requestHelper->input('vcv-data');
        $dataDecoded = $requestHelper->inputJson('vcv-data');
        $content = $requestHelper->input('vcv-content');
        $content = $filterHelper->fire('setData:updatePostData:content', $content);

        // @codingStandardsIgnoreStart
        // ['vcvPublicUploadUrl'] == 'httpx://domain/wp-content/uploads/visualcomposer-assets/*
        // ['vcvUploadUrl'] == 'httpx://domain/wp-content/uploads/*
        $assetUrl = $assetsHelper->getAssetUrl();
        $assetUrl = str_replace(['http://', 'https://'], '', $assetUrl);
        $content = str_replace(
            [
                'https://' . $assetUrl,
                'http://' . $assetUrl,
            ],
            '|!|vcvAssetsUploadUrl|!|',
            $content
        );

        $previewPost = [];
        $uploadDir = wp_upload_dir();
        $uploadUrl = $uploadDir['baseurl'];
        $uploadUrl = str_replace(['http://', 'https://'], '', $uploadUrl);
        $content = str_replace(
            [
                'https://' . $uploadUrl,
                'http://' . $uploadUrl,
            ],
            '|!|vcvUploadUrl|!|',
            $content
        );
        $post->post_content = $content;
        if (isset($dataDecoded['draft']) && $post->post_status !== 'publish') {
            $post->post_status = 'draft';
        } elseif (isset($dataDecoded['inherit'])) {
            $previewPost = $this->createPreviewPost($post, $sourceId);
        } else {
            if ($currentUserAccessHelper->wpAll(
                [get_post_type_object($post->post_type)->cap->publish_posts, $sourceId]
            )->get()) {
                if ($post->post_status !== 'private' && $post->post_status !== 'future') {
                    $post->post_status = 'publish';
                }
            } else {
                $post->post_status = 'pending';
            }
        }
        // @codingStandardsIgnoreEnd
        //temporarily disable
        kses_remove_filters();
        remove_filter('content_save_pre', 'balanceTags', 50);

        if (isset($dataDecoded['inherit']) && !empty($previewPost)) {
            // @codingStandardsIgnoreLine
            if ('draft' === $post->post_status || 'auto-draft' === $post->post_status) {
                // @codingStandardsIgnoreLine
                $post->post_status = 'draft';
                // @codingStandardsIgnoreLine
                wp_update_post($post);
                update_metadata('post', $sourceId, VCV_PREFIX . 'pageContent', $data);

                $previewSourceId = wp_update_post($previewPost[0]);
                update_metadata('post', $previewSourceId, VCV_PREFIX . 'pageContent', $data);
            } else {
                $previewSourceId = wp_update_post($previewPost[0]);
                update_metadata('post', $previewSourceId, VCV_PREFIX . 'pageContent', $data);
            }
        } else {
            wp_update_post($post);
            update_post_meta($sourceId, VCV_PREFIX . 'pageContent', $data);
        }

        $isAllowed = $optionsHelper->get('settings-itemdatacollection-enabled', false);
        if ($isAllowed) {
            $licenseType = $requestHelper->input('vcv-license-type');
            $elements = $requestHelper->input('vcv-elements');
            vcevent('vcv:saveUsageStats', ['response' => [], 'payload' => ['sourceId' => $sourceId, 'elements' => $elements, 'licenseType' => $licenseType]]);
        }

        //bring it back once you're done posting
        $postTypeHelper->setupPost($sourceId);
        $responseExtra = $filterHelper->fire(
            'vcv:dataAjax:setData',
            [
                'status' => true
            ],
            [
                'sourceId' => $sourceId,
                'post' => $post,
                'data' => $data,
            ]
        );
        // Clearing wp cache
        wp_cache_flush();
        // Flush global $post cache
        $postTypeHelper->setupPost($sourceId);
        $responseExtra['postData'] = $postTypeHelper->getPostData();
        ob_get_clean();

        return array_merge($response, $responseExtra);
    }
}
