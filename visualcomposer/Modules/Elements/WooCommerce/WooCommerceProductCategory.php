<?php

namespace VisualComposer\Modules\Elements\WooCommerce;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Modules\Elements\Traits\ShortcodesTrait;

class WooCommerceProductCategory extends WooCommerceController implements Module
{
    use ShortcodesTrait;

    private $shortcodeTag = 'product_category';

    private $shortcodeNs = 'woocommerce:';
}
