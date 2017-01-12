<?php
namespace VisualComposer\Helpers;

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
     * @param $payload
     *
     * @return mixed
     */
    public function parseTemplate($template, $payload)
    {
        $template = preg_replace_callback(
            $this->templateRegexp,
            function ($matches) use ($payload) {
                $this->call(
                    'templateCallback',
                    [
                        'matches' => $matches,
                        'payload' => $payload,
                    ]
                );
            },
            $template
        );

        return $template;
    }

    /**
     * @param $matches
     * @param $payload
     *
     * @return array|null|string
     */
    protected function templateCallback($matches, $payload)
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
                    'payload' => $payload,
                ]
            );
        }

        return $result;
    }
}
