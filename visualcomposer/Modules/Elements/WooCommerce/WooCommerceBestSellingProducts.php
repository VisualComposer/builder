<?php

namespace VisualComposer\Modules\Elements\WooCommerce;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Modules\Elements\Traits\ShortcodesTrait;

class WooCommerceBestSellingProducts extends WooCommerceController implements Module
{
    use ShortcodesTrait;

    private $shortcodeTag = 'best_selling_products';

    private $shortcodeNs = 'woocommerce:';
}
