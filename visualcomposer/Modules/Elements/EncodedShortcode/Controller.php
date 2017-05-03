<?php

namespace VisualComposer\Modules\Elements\EncodedShortcode;

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
