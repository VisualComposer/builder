<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;

class PostFields implements Helper
{
    public function getDefaultPostFields()
    {
        $imageFields = [
            [
                'key' => 'featured_image',
                'label' => esc_html__('Featured Image', 'vcwb'),
            ],
            [
                'key' => 'post_author_image',
                'label' => esc_html__('Author Profile Image', 'vcwb'),
            ],
            [
                'key' => 'wp_blog_logo',
                'label' => esc_html__('Blog Logo', 'vcwb'),
            ],
        ];

        return [
            'attachimage' => $imageFields,
            'designOptions' => $imageFields,
            'designOptionsAdvanced' => $imageFields,
            'string' => [
                [
                    'key' => 'post_title',
                    'label' => esc_html__('Post Title', 'vcwb'),
                ],
                [
                    'key' => 'post_author',
                    'label' => esc_html__('Post Author', 'vcwb'),
                ],
                [
                    'key' => 'post_id',
                    'label' => esc_html__('Post ID', 'vcwb'),
                ],
                [
                    'key' => 'post_excerpt',
                    'label' => esc_html__('Post Excerpt', 'vcwb'),
                ],
                [
                    'key' => 'post_type',
                    'label' => esc_html__('Post Type', 'vcwb'),
                ],
                [
                    'key' => 'post_categories',
                    'label' => esc_html__('Post Categories', 'vcwb'),
                ],
                [
                    'key' => 'post_tags',
                    'label' => esc_html__('Post Tags', 'vcwb'),
                ],
                [
                    'key' => 'post_comment_count',
                    'label' => esc_html__('Post Comment Count', 'vcwb'),
                ],
                [
                    'key' => 'post_date',
                    'label' => esc_html__('Post Date', 'vcwb'),
                ],
                [
                    'key' => 'post_modify_date',
                    'label' => esc_html__('Post Modify Date', 'vcwb'),
                ],
                [
                    'key' => 'post_parent_name',
                    'label' => esc_html__('Post Parent Name', 'vcwb'),
                ],
                [
                    'key' => 'post_author_bio',
                    'label' => esc_html__('Post Author Description', 'vcwb'),
                ],
                [
                    'key' => 'customMetaField::',
                    'label' => esc_html__('Other', 'vcwb'),
                ],
            ],
        ];
    }
}
