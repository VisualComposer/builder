<?php

namespace VisualComposer\Modules\Elements\EncodedShortcode;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Modules\Elements\Traits\AddShortcodeTrait;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class Controller extends Container implements Module
{
    use AddShortcodeTrait;
    use WpFiltersActions;

    public function __construct()
    {
        $this->addShortcode('vcv_encoded_shortcode');

        $this->wpAddFilter('wp_insert_post_data', [$this, 'checkEncodedShortcode']);
    }

    /**
     * Remove vcv_encoded_shortcode shortcode for users without unfiltered_html capability.
     *
     * @param array $data
     *
     * @return array
     */
    public function checkEncodedShortcode($data)
    {
        if (current_user_can('unfiltered_html')) {
            return $data;
        }

        if (strpos($data['post_content'], 'vcv_encoded_shortcode') === false) {
            return $data;
        }

        $data['post_content'] = preg_replace(
            '/\[\s*vcv_encoded_shortcode\s*\](.*?)\[\s*\/\s*vcv_encoded_shortcode\s*\]/si',
            '',
            $data['post_content']
        );

        return $data;
    }
}
