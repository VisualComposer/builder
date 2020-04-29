<?php

if (!defined('VCV_E2E')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

function e2e_create_post($data)
{
    $data = array_merge(
        [
            'meta_input' => [
                '_e2e-generated-test' => 1, // required for cleanDb
            ],
        ],
        $data
    );

    return wp_insert_post($data);
}

function e2e_clean_posts()
{
    $args = [
        'post_type' => 'any',
        'meta_query' => [
            [
                'key' => '_e2e-generated-test',
                'value' => '1',
                'compare' => '=',
            ],
        ],
    ];
    $query = new WP_Query($args);
    if (is_array($query->posts) && !empty($query->posts)) {
        foreach ($query->posts as $post) {
            wp_delete_post($post->ID, true);
        }
    }
}
