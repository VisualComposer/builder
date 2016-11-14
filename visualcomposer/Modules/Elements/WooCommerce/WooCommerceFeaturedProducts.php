<?php

namespace VisualComposer\Modules\Elements\WooCommerce;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Traits\EventsFilters;

class WooCommerceFeaturedProducts extends Container implements Module
{
    use EventsFilters;

    /**
     * Controller constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\Elements\WooCommerce\WooCommerceFeaturedProducts::render */
        $this->addFilter(
            'vcv:ajax:elements:woocommerce:featured_products',
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
        $per_page = isset($atts['per_page']) ? $atts['per_page'] : 12;
        $columns = isset($atts['columns']) ? $atts['columns'] : 4;
        $orderby = isset($atts['orderby']) ? $atts['orderby'] : 'date';
        $order = isset($atts['order']) ? $atts['order'] : 'desc';
        // TODO: Check \WC_Shortcodes::recent_products category and operator attributes (not documented)
        echo do_shortcode(
            sprintf(
                '[featured_products per_page="%d" columns="%d" orderby="%s" order="%s"]',
                (int)$per_page,
                (int)$columns,
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
