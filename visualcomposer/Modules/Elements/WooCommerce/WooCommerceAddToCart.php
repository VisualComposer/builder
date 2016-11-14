<?php

namespace VisualComposer\Modules\Elements\WooCommerce;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Framework\Container;
use VisualComposer\Modules\Elements\Traits\ShortcodesTrait;

class WooCommerceAddToCart extends Container implements Module
{
    use ShortcodesTrait;

    private $shortcodeTag = 'add_to_cart';

    private $shortcodeNs = 'woocommerce:';
}
