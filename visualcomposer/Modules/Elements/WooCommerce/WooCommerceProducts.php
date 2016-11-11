<?php

namespace VisualComposer\Modules\Elements\WooCommerce;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Traits\EventsFilters;

class WooCommerceProducts extends Container implements Module
{
    use EventsFilters;

    /**
     * Controller constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\Elements\WooCommerce\WooCommerceProducts::render */
        $this->addFilter(
            'vcv:ajax:elements:woocommerce:products',
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
        $selector = isset($atts['selector']) && in_array($atts['selector'], ['ids', 'skus']) ? $atts['selector']
            : 'ids';
        $ids = isset($atts['productIds']) ? $atts['productIds'] : '';
        $skus = isset($atts['productSkus']) ? $atts['productSkus'] : '';
        $columns = isset($atts['columns']) ? $atts['columns'] : 4;
        $orderby = isset($atts['orderby']) ? $atts['orderby'] : 'title';
        $order = isset($atts['productsOrder']) ? $atts['productsOrder'] : 'asc';
        $queryData = [];
        if ($selector === 'ids') {
            $queryData[] = sprintf('ids="%d"', $ids);
        } else {
            $queryData[] = sprintf('skus="%s"', $skus);
        }
        $query = implode(' ', $queryData);
        echo do_shortcode(
            sprintf(
                '[products %s columns="%d" orderby="%s" order="%s"]',
                $query,
                $columns,
                $orderby,
                $order
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
