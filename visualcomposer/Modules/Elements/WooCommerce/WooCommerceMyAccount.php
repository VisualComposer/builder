<?php

namespace VisualComposer\Modules\Elements\WooCommerce;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Modules\Elements\Traits\ShortcodesTrait;

class WooCommerceMyAccount extends WooCommerceController implements Module
{
    use ShortcodesTrait;

    private $shortcodeTag = 'woocommerce_my_account';

    private $shortcodeNs = 'woocommerce:';
}
