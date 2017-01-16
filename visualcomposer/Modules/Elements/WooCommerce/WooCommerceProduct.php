<?php

namespace VisualComposer\Modules\Elements\WooCommerce;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Modules\Elements\Traits\ShortcodesTrait;

class WooCommerceProduct extends WooCommerceController implements Module
{
    use ShortcodesTrait;

    private $shortcodeTag = 'product';

    private $shortcodeNs = 'woocommerce:';
}
