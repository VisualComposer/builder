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
            ],
        ];
    }
}
