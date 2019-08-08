<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;

/**
 * Class PostType
 * @package VisualComposer\Helpers
 */
class PostType implements Helper
{
    /**
     * @param $query
     *
     * @return array
     */
    public function query($query)
    {
        if (is_array($query) && !array_key_exists('suppress_filters', $query)) {
            $query['suppress_filters'] = false;
        } elseif (is_string($query) && strpos($query, 'suppress_filters') === false) {
            $query .= '&suppress_filters=0';
        }
        $posts = get_posts($query);

        return $posts;
    }

    /**
     * @param $query
     * @param $metaKey
     * @param bool $skipEmpty
     *
     * @return array
     */
    public function queryGroupByMetaKey($query, $metaKey, $skipEmpty = false)
    {
        $posts = get_posts($query);
        $results = [];
        foreach ($posts as $post) {
            $currentUserAccessHelper = vchelper('AccessCurrentUser');
            $metaValue = get_post_meta($post->ID, $metaKey, true);
            // @codingStandardsIgnoreLine
            if ($currentUserAccessHelper->wpAll([get_post_type_object($post->post_type)->cap->read, $post->ID])->get()
            ) {
                if ($metaValue) {
                    if (!isset($results[ $metaValue ])) {
                        $results[ $metaValue ] = [];
                    }
                    $results[ $metaValue ][] = $post;
                } elseif (!$skipEmpty) {
                    if (!isset($results[''])) {
                        $results[''] = [];
                    }
                    $results[''][] = $post;
                }
            }
        }

        return $results;
    }

    /**
     * @param $id
     * @param string $postType
     *
     * @return array|bool|null|\WP_Post
     */
    public function get($id = null, $postType = '')
    {
        if (is_home()) {
            $id = get_option('page_for_posts');
        } elseif (is_front_page()) {
            $id = get_option('page_on_front');
        }

        $post = get_post($id);
        // @codingStandardsIgnoreLine
        if (!$post || ($postType && $post->post_type !== $postType)) {
            $post = false;
        }

        return $post;
    }

    /**
     * @param $data
     *
     * @return int|\WP_Error
     */
    public function create($data)
    {
        $currentUserAccessHelper = vchelper('AccessCurrentUser');
        // @codingStandardsIgnoreLine
        if ($currentUserAccessHelper->wpAll('publish_posts')->get()) {
            return wp_insert_post($data);
        }

        return false;
    }

    /**
     * @param $data
     *
     * @return int|\WP_Error
     */
    public function update($data)
    {
        $userCapabilitiesHelper = vchelper('AccessUserCapabilities');
        $post = $this->get($data['ID']);
        if ($userCapabilitiesHelper->canEdit($post->ID)) {
            $post = wp_update_post($data);
            // @codingStandardsIgnoreStart
            if (!empty($data->meta_input) && !vchelper('Wp')->isMetaInput()) {
                foreach ($data->meta_input as $key => $value) {
                    update_post_meta($data->ID, $key, $value);
                }
            }

            // @codingStandardsIgnoreEnd
            return $post;
        }

        return false;
    }

    /**
     * @param $id
     * @param string $postType
     *
     * @return bool
     */
    public function delete($id, $postType = '')
    {
        $currentUserAccessHelper = vchelper('AccessCurrentUser');
        $post = $this->get($id);

        if ($currentUserAccessHelper->wpAll(
        // @codingStandardsIgnoreLine
            [get_post_type_object($post->post_type)->cap->delete_posts, $post->ID]
        )->get()
        ) {
            if ($postType) {
                // @codingStandardsIgnoreLine
                return $post && $post->post_type == $postType ? (bool)wp_delete_post($id) : !$post;
            }

            return (bool)wp_delete_post($id);
        }

        return !$post;
    }

    /**
     * @param $sourceId
     *
     * @return \WP_Post|false
     */
    public function setupPost($sourceId)
    {
        // @codingStandardsIgnoreStart
        global $post_type, $post_type_object, $post, $wp_query;
        $queryPost = get_post($sourceId);
        $currentUserAccessHelper = vchelper('AccessCurrentUser');

        if (isset($queryPost->post_type) && post_type_exists($queryPost->post_type)
            && $currentUserAccessHelper->wpAll(
                [get_post_type_object($queryPost->post_type)->cap->read, $queryPost->ID]
            )->get()) {
            $post = $queryPost;
            setup_postdata($post);
            /** @var \WP_Query $wp_query */
            $wp_query->queried_object = $post;
            if (!isset($wp_query->posts)) {
                $wp_query->posts = [];
            }
            $wp_query->posts[0] = $post;
            $wp_query->queried_object_id = $post->ID;
            $wp_query->is_singular = true;
            $post_type = $post->post_type;
            $post_type_object = get_post_type_object($post_type);

            // @codingStandardsIgnoreEnd
            return $post;
        }

        return false;
    }

    /**
     * @return array
     */
    public function getPostData()
    {
        // @codingStandardsIgnoreLine
        global $post_type_object, $post;
        $currentUserAccessHelper = vchelper('AccessCurrentUser');

        $data = [];

        $data['id'] = get_the_ID();
        // @codingStandardsIgnoreLine
        $data['status'] = $post->post_status;

        $permalink = get_permalink();
        if (!$permalink) {
            $permalink = '';
        }
        $nonce = wp_create_nonce('post_preview_' . $post->ID);
        $previewUrl = get_preview_post_link($post, ['preview_id' => $post->ID, 'preview_nonce' => $nonce]);
        // @codingStandardsIgnoreStart
        $viewable = is_post_type_viewable($post_type_object);
        // @codingStandardsIgnoreEnd
        $data['permalink'] = $permalink;
        $data['previewUrl'] = $previewUrl;
        // @codingStandardsIgnoreLine
        $data['viewable'] = $viewable && $post->post_status !== 'auto-draft';
        $data['canPublish'] = $currentUserAccessHelper->wpAll(
        // @codingStandardsIgnoreLine
            [$post_type_object->cap->publish_posts, $post->ID]
        )->get();
        $data['backendEditorUrl'] = str_replace('&classic-editor', '', get_edit_post_link($post->ID, 'url'));
        $data['adminDashboardUrl'] = self_admin_url('index.php');
        $data['adminDashboardPostTypeListUrl'] = self_admin_url('edit.php?post_type=' . get_post_type());
        // @codingStandardsIgnoreLine
        $data['viewText'] = sprintf(__('View %s', 'vcwb'), $post_type_object->labels->singular_name);

        return $data;
    }

    public function getPostTypes($extraExcluded = [])
    {
        $postTypes = get_post_types(
            [
                'public' => true,
            ]
        );
        $postTypesList = [];
        $excludedPostTypes = array_merge(
            [
                'revision',
                'nav_menu_item',
                'vc_grid_item',
            ],
            $extraExcluded
        );
        if (is_array($postTypes) && !empty($postTypes)) {
            foreach ($postTypes as $postType) {
                if (!in_array($postType, $excludedPostTypes, true)) {
                    $label = ucfirst($postType);
                    $postTypesList[] = [
                        'label' => $label,
                        'value' => $postType,
                    ];
                }
            }
        }

        /*
        $postTypesList[] = [
            'value' => 'custom',
            'label' => __('Custom Query', 'vcwb'),
        ];
        $postTypesList[] = [
            'value' => 'ids',
            'label' => __('List of IDs', 'vcwb'),
        ];
        */

        return $postTypesList;
    }

    public function getCustomPostTaxonomies($postType)
    {
        return get_object_taxonomies($postType, 'objects');
    }

    public function getCustomPostCategories($taxonomy)
    {
        $categories = [];

        $terms = get_terms($taxonomy);
        if (!is_wp_error($terms) && !empty($terms)) {
            foreach ($terms as $term) {
                $categories[] = [
                    'label' => $term->name,
                    // @codingStandardsIgnoreLine
                    'value' => $term->term_id,
                ];
            }
        }

        return $categories;
    }
}
