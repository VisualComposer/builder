<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Helper;

/**
 * Class GridItemTemplate
 * @package VisualComposer\Helpers
 */
class GridItemTemplate extends Container implements Helper
{
    protected $templateRegexp = '/\{\{\s*([^\}\:\s]+)(?:\:)?([^\}\s]+)?\s*\}\}/';

    /**
     * @param $template
     * @param \WP_Post $post
     *
     * @return mixed
     */
    public function parseTemplate($template, $post)
    {
        $template = preg_replace_callback(
            $this->templateRegexp,
            function ($matches) use ($post) {
                /** @see \VisualComposer\Helpers\GridItemTemplate::templateCallback */
                return $this->call(
                    'templateCallback',
                    [
                        'matches' => $matches,
                        'post' => $post,
                    ]
                );
            },
            $template
        );

        return $template;
    }

    /**
     * @param $matches
     * @param \WP_Post $post
     *
     * @return array|null|string
     */
    protected function templateCallback($matches, $post)
    {
        list($fullMatch, $key, $value) = array_pad($matches, 3, null);
        $result = '';
        if ($key) {
            $result = vcfilter(
                'vcv:elements:grid_item_template:variable:' . $key,
                '',
                [
                    'fullMatch' => $fullMatch,
                    'key' => $key,
                    'value' => $value,
                    'post' => $post,
                ]
            );
        }

        return $result;
    }
}
