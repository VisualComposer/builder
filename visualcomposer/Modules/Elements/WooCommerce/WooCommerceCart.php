<?php

namespace VisualComposer\Modules\Elements\WooCommerce;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Traits\EventsFilters;

class WooCommerceCart extends Container implements Module
{
    use EventsFilters;

    /**
     * Controller constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\Elements\WooCommerce\WooCommerceCart::render */
        $this->addFilter(
            'vcv:ajax:elements:woocommerce:woocommerce_cart',
            'render'
        );
        /** @see \VisualComposer\Modules\Elements\WooCommerce\WooCommerceCart::renderClean */
        $this->addFilter(
            'vcv:ajax:elements:woocommerce:woocommerce_cart:clean',
            'renderClean'
        );
    }

    /**
     * @param \VisualComposer\Helpers\Request $request
     *
     * @return string
     */
    private function render(Request $request)
    {
        ob_start();
        echo do_shortcode('[woocommerce_cart]');
        wp_print_styles();
        print_late_styles();
        wp_print_head_scripts();
        wp_print_footer_scripts();
        $response = ob_get_clean();

        return $response;
    }

    /**
     * @param \VisualComposer\Helpers\Request $request
     *
     * @return string
     */
    private function renderClean(Request $request)
    {
        return '[woocommerce_cart]';
    }
}
