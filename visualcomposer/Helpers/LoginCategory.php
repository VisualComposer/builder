<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;

class LoginCategory implements Helper
{
    /**
     * @return array
     */
    public function all()
    {
        $categories = [
            'Business' => __('Business', 'vcwb'),
            'Blog' => __('Blog', 'vcwb'),
            'Creative Arts' => __('Creative Arts', 'vcwb'),
            'Community & Education' => __('Community & Education', 'vcwb'),
            'Design' => __('Design', 'vcwb'),
            'Entertainment & Music' => __('Entertainment & Music', 'vcwb'),
            'Events' => __('Events', 'vcwb'),
            'Fashion & Beauty' => __('Fashion & Beauty', 'vcwb'),
            'Health & Wellness' => __('Health & Wellness', 'vcwb'),
            'Landing Pages' => __('Landing Pages', 'vcwb'),
            'Online Store' => __('Online Store', 'vcwb'),
            'Photography' => __('Photography', 'vcwb'),
            'Portfolio & Personal' => __('Portfolio & Personal', 'vcwb'),
            'Restaurants & Food' => __('Restaurants & Food', 'vcwb'),
            'Services' => __('Services', 'vcwb'),
            'Travel & Accommodation' => __('Travel & Accommodation', 'vcwb'),
            'Other' => __('Other', 'vcwb'),
        ];

        return $categories;
    }

    public function get($key)
    {
        $all = $this->all();

        return isset($all[ $key ]) ? $all[ $key ] : '';
    }
}
