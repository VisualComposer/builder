<?php

namespace VisualComposer\Modules\Elements\Traits;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

/**
 * Class AddShortcodeTrait
 * @package VisualComposer\Modules\Elements\Traits
 */
trait AddShortcodeTrait
{
    /**
     * @param $tag
     * @param $callback
     */
    protected function addShortcode($tag, $callback = '')
    {
        add_shortcode(
            $tag,
            function ($atts, $content, $tag) use ($callback) {
                /** @var $this \VisualComposer\Framework\Container */
                /** @var $this \VisualComposer\Framework\Illuminate\Container\Container */
                // Save way to work in WordPress content (prevents all modifications)
                // @codingStandardsIgnoreLine
                $content = base64_decode(rawurldecode($content));

                return !empty($callback) ? $this->call($callback, [$atts, $content, $tag]) : $content;
            }
        );
    }
}
