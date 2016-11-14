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

    /**
     * @param \VisualComposer\Helpers\Request $request
     *
     * @return string
     */
    protected function renderEditor(Request $request)
    {
        ob_start();
        $atts = $request->input('vcv-atts');
        $order_count = isset($atts['order_count']) ? $atts['order_count'] : 15;
        echo do_shortcode(sprintf('[woocommerce_my_account order_count="%d"]', (int)$order_count));
        wp_print_styles();
        print_late_styles();
        wp_print_head_scripts();
        wp_print_footer_scripts();
        $response = ob_get_clean();

        return $response;
    }
}
