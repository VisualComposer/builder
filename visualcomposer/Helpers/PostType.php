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
}
