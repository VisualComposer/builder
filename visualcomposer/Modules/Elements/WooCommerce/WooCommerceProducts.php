<?php

namespace VisualComposer\Modules\Elements\WooCommerce;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Framework\Container;
use VisualComposer\Modules\Elements\Traits\ShortcodesTrait;

class WooCommerceProducts extends Container implements Module
{
    use ShortcodesTrait;

    private $shortcodeTag = 'products';

    private $shortcodeNs = 'woocommerce:';
}
