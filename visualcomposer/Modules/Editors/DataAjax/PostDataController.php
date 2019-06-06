<?php

namespace VisualComposer\Modules\Editors\DataAjax;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;

/**
 * Class PostDataController
 * @package VisualComposer\Modules\Editors\DataAjax
 */
class PostDataController extends Container implements Module
{
    use EventsFilters;

    /**
     * Use for dynamic fields components
     * PostDataController constructor.
     */
    public function __construct()
    {
        $this->addFilter(
            'vcv:dataAjax:getData',
            'getPostData'
        );
    }

    /**
     * @param $response
     * @param $payload
     *
     * @return mixed
     */
    protected function getPostData($response, $payload)
    {
        $defaultPostData = $this->getDefaultPostData();
        $response['postData'] = vcfilter('vcv:editor:data:postData', $defaultPostData);

        return $response;
    }

    protected function getDefaultPostData()
    {
        /** @var \VisualComposer\Helpers\PostData $postDataHelper */
        $postDataHelper = vchelper('PostData');
        $response = [];
        $response['featured_image'] = $postDataHelper->getFeaturedImage();
        $response['post_author_image'] = $postDataHelper->getPostAuthorImage();
        $response['post_author'] = $postDataHelper->getPostAuthor();
        $response['post_title'] = $postDataHelper->getPostTitle();
        $response['post_id'] = (string)$postDataHelper->getPostId();
        $response['post_type'] = $postDataHelper->getPostType();
        $response['post_excerpt'] = $postDataHelper->getPostExcerpt();
        $response['wp_blog_logo'] = $postDataHelper->getBlogLogo();
        $response['post_categories'] = $postDataHelper->getPostCategories();
        $response['post_tags'] = $postDataHelper->getPostTags();
        $response['post_comment_count'] = $postDataHelper->getPostCommentCount();
        $response['post_date'] = $postDataHelper->getPostDate();
        $response['post_modify_date'] = $postDataHelper->getPostModifyDate();
        $response['post_parent_name'] = $postDataHelper->getPostParentName();
        $response['post_author_bio'] = $postDataHelper->getPostAuthorBio();

        return $response;
    }
}
