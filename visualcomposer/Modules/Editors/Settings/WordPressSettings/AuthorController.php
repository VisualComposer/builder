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

class AuthorController extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    public function __construct()
    {
        $this->addFilter(
            'vcv:ajax:dropdown:author:updateList:adminNonce',
            'getAuthorListForUpdate',
            11
        );
        $this->addFilter(
            'vcv:dataAjax:setData',
            'setData'
        );
        $this->addFilter(
            'vcv:frontend:head:extraOutput',
            'outputAuthorList'
        );
    }

    /**
     * Get author list
     *
     * @return array|false[]
     */
    protected function getAuthorList()
    {
        // @codingStandardsIgnoreLine
        global $wp_version;
        $requestHelper = vchelper('Request');
        $postTypeHelper = vchelper('PostType');
        $currentPost = $postTypeHelper->get();

        // Set source id for ajax requests
        if (!$currentPost && $requestHelper->exists('vcv-source-id')) {
            $sourceId = $requestHelper->input('vcv-source-id');
            $currentPost = $postTypeHelper->get($sourceId);
        }

        // @codingStandardsIgnoreLine
        $currentPostAuthor = $currentPost->post_author;

        // Capability queries were only introduced in WP 5.9.
        // @codingStandardsIgnoreLine
        if (version_compare($wp_version, '5.9-alpha', '>=')) {
            $users = get_users(['capability' => ['edit_posts' ]]);
        } else {
            $users = get_users('who=authors');
        }
        $authorList = [];
        foreach ($users as $user) {
            // translators: %1$s: Author name., %2$s: Author login.
            $dropdownText = sprintf(_x('%1$s (%2$s)', 'visualcomposer'), $user->display_name, $user->user_login);
            $authorList[] = [
                'label' => $dropdownText,
                'value' => (string)$user->ID,
            ];
        }

        return [
            'current' => $currentPostAuthor,
            'all' => count($authorList) > 0 ? $authorList : false,
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
    protected function outputAuthorList(
        $response,
        $payload,
        PostType $postTypeHelper
    ) {
        $currentUserAccessHelper = vchelper('AccessCurrentUser');
        $currentPost = $postTypeHelper->get();

        // @codingStandardsIgnoreLine
        if (
            $currentUserAccessHelper->wpAll(
                // @codingStandardsIgnoreLine
                [get_post_type_object($currentPost->post_type)->cap->publish_posts, $currentPost->ID]
                // @codingStandardsIgnoreLine
            )->get() && post_type_supports($currentPost->post_type, 'author')
        ) {
            $response = array_merge(
                $response,
                [
                    vcview(
                        'partials/variableTypes/variable',
                        [
                            'key' => 'VCV_AUTHOR_LIST',
                            'value' => $this->getAuthorList(),
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
    protected function getAuthorListForUpdate()
    {
        $authorList = $this->getAuthorList();

        return ['status' => true, 'data' => $authorList['all']];
    }

    /**
     * Set author
     *
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\Request $requestHelper
     *
     * @return mixed
     */
    protected function setData($response, $payload, Request $requestHelper)
    {
        $currentPageId = vchelper('Preview')->updateSourceIdWithAutosaveId($payload['sourceId']);
        if ($requestHelper->exists('vcv-settings-author')) {
            $authorId = $requestHelper->input('vcv-settings-author');
            if (empty($authorId)) {
                return $response;
            }
            $authorData = get_userdata((int)$authorId);

            if ($authorData) {
                wp_update_post(['ID' => $currentPageId, 'post_author' => $authorData->ID]);
            }
        }

        return $response;
    }
}
