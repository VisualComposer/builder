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

        $this->wpAddFilter('content_save_pre', [$this, 'checkEncodedShortcode']);
    }

    /**
     * Remove vcv_encoded_shortcode shortcode for users without unfiltered_html capability.
     *
     * @param string $content
     *
     * @return string
     */
    public function checkEncodedShortcode($content)
    {
        if (current_user_can('unfiltered_html')) {
            return $content;
        }

        if (strpos($content, 'vcv_encoded_shortcode') === false) {
            return $content;
        }

        $regex = $this->get_shortcode_regex('vcv_encoded_shortcode');
        return preg_replace('/' . $regex . '/', '', $content);
    }

    /**
     * Get the shortcode regex.
     *
     * @param string $tagregexp
     *
     * @return string
     */
    public function get_shortcode_regex($tagregexp = '')
    {
        if (0 === strlen($tagregexp)) {
            return get_shortcode_regex();
        }

        return '\\['                              // Opening bracket.
            . '(\\[?)'                           // 1: Optional second opening bracket for escaping shortcodes: [[tag]].
            . "($tagregexp)"                     // 2: Shortcode name.
            . '(?![\\w\-])'                       // Not followed by word character or hyphen.
            . '('                                // 3: Unroll the loop: Inside the opening shortcode tag.
            . '[^\\]\\/]*'                   // Not a closing bracket or forward slash.
            . '(?:' . '\\/(?!\\])'               // A forward slash not followed by a closing bracket.
            . '[^\\]\\/]*'               // Not a closing bracket or forward slash.
            . ')*?' . ')' . '(?:' . '(\\/)'                        // 4: Self closing tag .
            . '\\]'                          // ... and closing bracket.
            . '|' . '\\]'                          // Closing bracket.
            . '(?:' . '('                        // 5: Unroll the loop: Optionally, anything between the opening and closing shortcode tags.
            . '[^\\[]*+'             // Not an opening bracket.
            . '(?:' . '\\[(?!\\/\\2\\])' // An opening bracket not followed by the closing shortcode tag.
            . '[^\\[]*+'         // Not an opening bracket.
            . ')*+' . ')' . '\\[\\/\\2\\]'             // Closing shortcode tag.
            . ')?' . ')' . '(\\]?)';
    }
}
