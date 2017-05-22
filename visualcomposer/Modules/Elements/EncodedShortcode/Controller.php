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

class Controller extends Container implements Module
{
    use AddShortcodeTrait;

    public function __construct()
    {
        $this->addShortcode('vcv_encoded_shortcode');
    }
}
