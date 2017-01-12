<?php

namespace VisualComposer\Modules\Elements\WooCommerce;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Modules\Elements\Traits\ShortcodesTrait;

class WooCommerceFeaturedProducts extends WooCommerceController implements Module
{
    use ShortcodesTrait;

    private $shortcodeTag = 'featured_products';

    private $shortcodeNs = 'woocommerce:';
}
