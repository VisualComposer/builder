<?php

namespace VisualComposer\Modules\Elements\WooCommerce;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Modules\Elements\Traits\ShortcodesTrait;

class WooCommerceSaleProducts extends WooCommerceController implements Module
{
    use ShortcodesTrait;

    private $shortcodeTag = 'sale_products';

    private $shortcodeNs = 'woocommerce:';
}
