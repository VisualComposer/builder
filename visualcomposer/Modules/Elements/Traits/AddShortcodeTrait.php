<?php

namespace VisualComposer\Modules\Elements\Traits;

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
    protected function addShortcode($tag, $callback)
    {
        add_shortcode(
            $tag,
            function ($atts, $content, $tag) use ($callback) {
                /** @var $this \VisualComposer\Framework\Container */
                /** @var $this \VisualComposer\Framework\Illuminate\Container\Container */
                return $this->call($callback, [$atts, $content, $tag]);
            }
        );
    }
}
