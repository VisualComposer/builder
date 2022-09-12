<?php

namespace VisualComposer\Helpers;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;
use function VisualComposer\Framework\esc_html;

class Output implements Helper
{
    public function printNotEscaped($content)
    {
        echo esc_html($content);
    }

    public function printEscaped($content)
    {
        echo \esc_html($content);
    }
}
