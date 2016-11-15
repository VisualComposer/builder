<?php

namespace VisualComposer\Modules\Elements\WooCommerce;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Framework\Container;
use VisualComposer\Modules\Elements\Traits\ShortcodesTrait;

class WooCommerceAddToCartUrl extends Container implements Module
{
    use ShortcodesTrait;

    private $shortcodeTag = 'add_to_cart_url';

    private $shortcodeNs = 'woocommerce:';
}
