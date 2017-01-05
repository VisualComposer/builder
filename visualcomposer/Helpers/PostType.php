<?php

namespace VisualComposer\Helpers;

use VisualComposer\Framework\Illuminate\Support\Helper;

class PostType implements Helper
{
    public function query($q)
    {
        $posts = get_posts($q);

        return $posts;
    }

    public function get($id, $postType = '')
    {
        $post = get_post($id);
        if ($postType && $post->post_type !== $postType) {
            $post = false;
        }

        return $post;
    }

    public function create($data)
    {
        return wp_insert_post($data);
    }

    public function update($data)
    {
        $post = wp_update_post($data);
        if (!empty($data->meta_input) && !vchelper('Wp')->isMetaInput()) {
            foreach ($data->meta_input as $key => $value) {
                update_post_meta($data->ID, $key, $value);
            }
        }

        return $post;
    }

    public function delete($id, $postType = '')
    {
        if ($postType) {
            $post = $this->get($id);

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
        global $post_type, $post_type_object, $post;
        $post = get_post($sourceId);
        setup_postdata($post);
        $post_type = $post->post_type;
        $post_type_object = get_post_type_object($post_type);
        set_current_screen($post_type);

        return $post;
    }

    /**
     * @return array
     */
    public function getPostData()
    {
        global $post_type_object, $post;
        $data = [];

        $data['id'] = get_the_ID();
        $data['status'] = $post->post_status;

        $permalink = get_permalink();
        if (!$permalink) {
            $permalink = '';
        }
        $previewUrl = get_preview_post_link($post);
        $viewable = is_post_type_viewable($post_type_object);
        $data['permalink'] = $permalink;
        $data['previewUrl'] = $previewUrl;
        $data['viewable'] = $viewable;
        // TODO: Add access checks for post types
        $data['canPublish'] = current_user_can($post_type_object->cap->publish_posts);
        $data['backendEditorUrl'] = get_edit_post_link($post->ID, 'url');
        $data['adminDashboardUrl'] = self_admin_url('index.php');

        return $data;
    }
}
