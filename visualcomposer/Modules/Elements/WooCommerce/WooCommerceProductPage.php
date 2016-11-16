<?php

namespace VisualComposer\Modules\Elements\WooCommerce;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Framework\Container;
use VisualComposer\Modules\Elements\Traits\ShortcodesTrait;

class WooCommerceProductPage extends Container implements Module
{
    use ShortcodesTrait;

    private $shortcodeTag = 'product_page';

    private $shortcodeNs = 'woocommerce:';
}
