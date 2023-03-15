<?php

if (!defined('VCV_E2E')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

function e2e_create_post($data)
{
    if (empty($data)) {
        $data = [
            'post_title' => 'Test e2e Post',
            'post_content' => 'Test e2e Post Content',
            'post_status' => 'publish',
        ];
    }

    $data = array_merge_recursive(
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
        'post_type' => array_keys(get_post_types()),
        'post_status' => 'any',
        'meta_query' => [
            [
                'key' => '_e2e-generated-test',
                'value' => '1',
                'compare' => '=',
            ],
        ],
        'posts_per_page' => '-1',
    ];
    $query = new WP_Query($args);
    if (is_array($query->posts) && !empty($query->posts)) {
        foreach ($query->posts as $post) {
            wp_delete_post($post->ID, true);
        }
    }
}

function e2e_clean_terms()
{
    $args = [
        'hide_empty' => false,
        'meta_query' => [
            [
                'key' => '_e2e-generated-test',
                'value' => '1',
                'compare' => '=',
            ],
        ],
    ];
    $termList = get_terms($args);

    foreach ($termList as $term) {
        wp_delete_term($term->term_id, $term->taxonomy);
    }
}

function e2e_clean_images()
{
    $args = [
        'post_type' => 'attachment',
        'post_status' => 'any',
        'meta_query' => [
            [
                'key' => '_e2e-generated-test',
                'value' => '1',
                'compare' => '=',
            ],
        ],
        'posts_per_page' => '-1',
    ];
    $query = new WP_Query($args);
    if (is_array($query->posts) && !empty($query->posts)) {
        foreach ($query->posts as $post) {
            wp_delete_attachment( $post->ID, true );
        }
    }
}

function e2e_add_rewrite_rules()
{
    add_filter(
        'pre_option_rewrite_rules',
        function () {
            return [
                'wp-content/plugins/' . VCV_PLUGIN_DIRNAME . '/tests/php-e2e-actions/init.php' => '',
                'wp-contentplugins' . VCV_PLUGIN_DIRNAME . 'testsphp-e2e-actionsinit\.php' => '',
            ];
        }
    );
}

function e2e_create_vcv_global_header()
{
    return e2e_create_post(
        [
            'post_title' => 'test-themeEditor-global-header',
            'post_content' => 'This is global header',
            'post_status' => 'publish',
            'post_type' => 'vcv_headers',
        ]
    );
}

function e2e_create_vcv_global_footer()
{
    return e2e_create_post(
        [
            'post_title' => 'test-themeEditor-global-footer',
            'post_content' => 'This is global footer',
            'post_status' => 'publish',
            'post_type' => 'vcv_footers',
        ]
    );
}

function e2e_create_vcv_header()
{
    return e2e_create_post(
        [
            'post_title' => 'test-themeEditor-header',
            'post_content' => 'This is header',
            'post_status' => 'publish',
            'post_type' => 'vcv_headers',
        ]
    );
}

function e2e_create_vcv_footer()
{
    return e2e_create_post(
        [
            'post_title' => 'test-themeEditor-footer',
            'post_content' => 'This is footer',
            'post_status' => 'publish',
            'post_type' => 'vcv_footers',
        ]
    );
}

function e2e_create_vcv_sidebar()
{
    return e2e_create_post(
        [
            'post_title' => 'test-themeEditor-sidebar',
            'post_content' => 'This is sidebar',
            'post_status' => 'publish',
            'post_type' => 'vcv_sidebars',
        ]
    );
}
