<?php

namespace VisualComposer\Helpers;

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
        $posts = get_posts($query);

        return $posts;
    }

    /**
     * @param $id
     * @param string $postType
     *
     * @return array|bool|null|\WP_Post
     */
    public function get($id, $postType = '')
    {
        $post = get_post($id);
        // @codingStandardsIgnoreStart
        if ($postType && $post->post_type !== $postType) {
            $post = false;
        }
        // @codingStandardsIgnoreEnd

        return $post;
    }

    /**
     * @param $data
     *
     * @return int|\WP_Error
     */
    public function create($data)
    {
        return wp_insert_post($data);
    }

    /**
     * @param $data
     *
     * @return int|\WP_Error
     */
    public function update($data)
    {
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

    /**
     * @param $id
     * @param string $postType
     *
     * @return array|bool|false|\WP_Post
     */
    public function delete($id, $postType = '')
    {
        if ($postType) {
            $post = $this->get($id);
            // @codingStandardsIgnoreLine
            return $post && $post->post_type == $postType ? wp_delete_post($id) : !$post;
        }

        return wp_delete_post($id);
    }

    /**
     * @param $sourceId
     *
     * @return \WP_Post
     */
    public function setupPost($sourceId)
    {
        // @codingStandardsIgnoreStart
        global $post_type, $post_type_object, $post;
        $post = get_post($sourceId);
        setup_postdata($post);
        $post_type = $post->post_type;
        $post_type_object = get_post_type_object($post_type);
        // @codingStandardsIgnoreEnd
        return $post;
    }

    /**
     * @return array
     */
    public function getPostData()
    {
        // @codingStandardsIgnoreLine
        global $post_type_object, $post;
        $data = [];

        $data['id'] = get_the_ID();
        // @codingStandardsIgnoreLine
        $data['status'] = $post->post_status;

        $permalink = get_permalink();
        if (!$permalink) {
            $permalink = '';
        }
        $previewUrl = get_preview_post_link($post);
        // @codingStandardsIgnoreLine
        $viewable = is_post_type_viewable($post_type_object);
        $data['permalink'] = $permalink;
        $data['previewUrl'] = $previewUrl;
        $data['viewable'] = $viewable;
        // TODO: Add access checks for post types
        // @codingStandardsIgnoreLine
        $data['canPublish'] = current_user_can($post_type_object->cap->publish_posts);
        $data['backendEditorUrl'] = get_edit_post_link($post->ID, 'url');
        $data['adminDashboardUrl'] = self_admin_url('index.php');

        return $data;
    }
}
