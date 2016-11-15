<?php

namespace VisualComposer\Modules\Elements\WooCommerce;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Framework\Container;
use VisualComposer\Modules\Elements\Traits\ShortcodesTrait;

class WooCommerceMyAccount extends Container implements Module
{
    use ShortcodesTrait;

    private $shortcodeTag = 'woocommerce_my_account';

    private $shortcodeNs = 'woocommerce:';
}
