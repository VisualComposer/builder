<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Helper;

class DefaultElements extends Container implements Helper
{
    public function all()
    {
        $elementsToRegister = [
            'row',
            'column',
            'textBlock',
            'singleImage',
            'basicButton',
            'googleFontsHeading',
            'youtubePlayer',
            'vimeoPlayer',
            'separator',
            'wpWidgetsCustom',
            'wpWidgetsDefault',
            'shortcode',
            'outlineButton',
        ];

        return $elementsToRegister;
    }
}
