<?php

namespace VisualComposer\Modules\Elements\WooCommerce;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Framework\Container;
use VisualComposer\Modules\Elements\Traits\ShortcodesTrait;

class WooCommerceTopRatedProducts extends Container implements Module
{
    use ShortcodesTrait;

    private $shortcodeTag = 'top_rated_products';

    private $shortcodeNs = 'woocommerce:';
}
