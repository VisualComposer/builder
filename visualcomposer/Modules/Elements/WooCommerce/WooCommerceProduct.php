<?php

namespace VisualComposer\Modules\Elements\WooCommerce;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Traits\EventsFilters;

class WooCommerceProduct extends Container implements Module
{
    use EventsFilters;

    /**
     * Controller constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\Elements\WooCommerce\WooCommerceProduct::render */
        $this->addFilter(
            'vcv:ajax:elements:woocommerce:product',
            'render'
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
        $atts = $request->input('vcv-atts');
        $selector = isset($atts['selector']) && in_array($atts['selector'], ['id', 'sku']) ? $atts['selector'] : 'id';
        $id = isset($atts['productId']) ? $atts['productId'] : '';
        $sku = isset($atts['productSku']) ? $atts['productSku'] : '';
        $queryData = [];
        if ($selector === 'id') {
            $queryData[] = sprintf('id="%d"', (int)$id);
        } else {
            $queryData[] = sprintf('sku="%s"', $sku);
        }
        $query = implode(' ', $queryData);
        echo do_shortcode(
            sprintf(
                '[product %s]',
                $query
            )
        );
        wp_print_styles();
        print_late_styles();
        wp_print_head_scripts();
        wp_print_footer_scripts();
        $response = ob_get_clean();

        return $response;
    }
}
