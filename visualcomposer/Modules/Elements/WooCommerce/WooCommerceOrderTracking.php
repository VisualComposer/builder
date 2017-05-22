<?php

namespace VisualComposer\Modules\Elements\WooCommerce;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Modules\Elements\Traits\ShortcodesTrait;

class WooCommerceOrderTracking extends WooCommerceController implements Module
{
    use ShortcodesTrait;

    private $shortcodeTag = 'woocommerce_order_tracking';

    private $shortcodeNs = 'woocommerce:';
}
