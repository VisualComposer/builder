<?php

namespace VisualComposer\Modules\Elements\WooCommerce;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Framework\Container;
use VisualComposer\Modules\Elements\Traits\ShortcodesTrait;

class WooCommerceProducts extends Container implements Module
{
    use ShortcodesTrait;

    private $shortcodeTag = 'products';

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
