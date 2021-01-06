<?php

namespace VisualComposer\Modules\Editors\Settings\WordPressSettings;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\PostType;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class ParentPageController extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    public function __construct()
    {
        $this->addFilter(
            'vcv:ajax:dropdown:parentPage:updateList:adminNonce',
            'getPageListForUpdate',
            11
        );
        $this->addFilter(
            'vcv:dataAjax:setData',
            'setData'
        );
        $this->addFilter(
            'vcv:frontend:head:extraOutput',
            'outputPageList'
        );
    }

    /**
     * Get page list
     *
     * @return array|false[]
     */
    protected function getPageList()
    {
        $requestHelper = vchelper('Request');
        $postTypeHelper = vchelper('PostType');
        $currentPost = $postTypeHelper->get();

        $currentParentPage = 'none';
        $pages[] = ['label' => __('None', 'visualcomposer'), 'value' => 'none'];
        // @codingStandardsIgnoreLine
        $postQuery = ['post_type' => $currentPost->post_type, 'posts_per_page' => -1];

        // Set source id for ajax requests
        if (!$currentPost && $requestHelper->exists('vcv-source-id')) {
            $sourceId = $requestHelper->input('vcv-source-id');
            $currentPost = $postTypeHelper->get($sourceId);
        }

        // Exclude current post
        if ($currentPost) {
            $postQuery['post__not_in'][] = $currentPost->ID;
        }

        // Get all pages except current page
        $posts = $postTypeHelper->query($postQuery);
        foreach ($posts as $post) {
            /** @var \WP_Post $post */
            // @codingStandardsIgnoreLine
            $pages[] = ['label' => $post->post_title, 'value' => (string)$post->ID];
        }

        // @codingStandardsIgnoreLine
        if (isset($currentPost->post_parent) && $currentPost->post_parent !== 0) {
            // @codingStandardsIgnoreLine
            $currentParentPage = (string)$currentPost->post_parent;
        }

        return [
            'current' => $currentParentPage,
            'all' => count($pages) > 0 ? $pages : false,
        ];
    }

    /**
     * @param $response
     * @param $payload
     *
     * @param \VisualComposer\Helpers\PostType $postTypeHelper
     *
     * @return mixed
     */
    protected function outputPageList(
        $response,
        $payload,
        PostType $postTypeHelper
    ) {
        $currentPost = $postTypeHelper->get();
        // @codingStandardsIgnoreLine
        if (isset($currentPost->post_type) && post_type_supports( $currentPost->post_type, 'page-attributes' )) {
            $response = array_merge(
                $response,
                [
                    vcview(
                        'partials/variableTypes/variable',
                        [
                            'key' => 'VCV_PAGE_LIST',
                            'value' => $this->getPageList(),
                        ]
                    ),
                ]
            );
        }
        return $response;
    }

    /**
     * @return array
     */
    protected function getPageListForUpdate()
    {
        $pageList = $this->getPageList();
        return ['status' => true, 'data' => $pageList['all']];
    }

    /**
     * Set parent page
     *
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\Request $requestHelper
     *
     * @return mixed
     */
    protected function setData($response, $payload, Request $requestHelper)
    {
        $currentPageId = $payload['sourceId'];
        if ($requestHelper->exists('vcv-settings-parent-page')) {
            wp_update_post(
                ['ID' => $currentPageId, 'post_parent' => $requestHelper->input('vcv-settings-parent-page')]
            );
        }

        return $response;
    }
}
