<?php

namespace VisualComposer\Modules\Elements\WooCommerce;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Modules\Elements\Traits\ShortcodesTrait;

class WooCommerceCheckout extends WooCommerceController implements Module
{
    use ShortcodesTrait;

    private $shortcodeTag = 'woocommerce_checkout';

    private $shortcodeNs = 'woocommerce:';
}
