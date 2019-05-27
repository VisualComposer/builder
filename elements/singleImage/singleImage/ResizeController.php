<?php

namespace singleImage\singleImage;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;

class ResizeController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        $this->addFilter('setData:updatePostData:content vcv:templates:create:content', 'parseContent');
    }

    protected function parseContent($content)
    {
        $parsedContent = preg_replace_callback(
            '/\[vcvSingleImage (.*?)\]/si',
            function ($matches) {
                return vchelper('Image')->parseImage($matches);
            },
            $content
        );

        return $parsedContent;
    }
}
