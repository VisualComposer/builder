<?php

namespace VisualComposer\Modules\Elements\WooCommerce;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Modules\Elements\Traits\ShortcodesTrait;

class WooCommerceProduct extends WooCommerceController implements Module
{
    use ShortcodesTrait;

    private $shortcodeTag = 'product';

    private $shortcodeNs = 'woocommerce:';
}
