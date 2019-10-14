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
            'Business' => __('Business', 'visualcomposer'),
            'Blog' => __('Blog', 'visualcomposer'),
            'Creative Arts' => __('Creative Arts', 'visualcomposer'),
            'Community & Education' => __('Community & Education', 'visualcomposer'),
            'Design' => __('Design', 'visualcomposer'),
            'Entertainment & Music' => __('Entertainment & Music', 'visualcomposer'),
            'Events' => __('Events', 'visualcomposer'),
            'Fashion & Beauty' => __('Fashion & Beauty', 'visualcomposer'),
            'Health & Wellness' => __('Health & Wellness', 'visualcomposer'),
            'Landing Pages' => __('Landing Pages', 'visualcomposer'),
            'Online Store' => __('Online Store', 'visualcomposer'),
            'Photography' => __('Photography', 'visualcomposer'),
            'Portfolio & Personal' => __('Portfolio & Personal', 'visualcomposer'),
            'Restaurants & Food' => __('Restaurants & Food', 'visualcomposer'),
            'Services' => __('Services', 'visualcomposer'),
            'Travel & Accommodation' => __('Travel & Accommodation', 'visualcomposer'),
            'Other' => __('Other', 'visualcomposer'),
        ];

        return $categories;
    }

    public function get($key)
    {
        $all = $this->all();

        return isset($all[ $key ]) ? $all[ $key ] : '';
    }
}
