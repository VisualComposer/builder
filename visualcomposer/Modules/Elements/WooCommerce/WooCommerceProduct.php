<?php

namespace VisualComposer\Modules\Elements\WooCommerce;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Framework\Container;
use VisualComposer\Modules\Elements\Traits\ShortcodesTrait;

class WooCommerceProduct extends Container implements Module
{
    use ShortcodesTrait;

    private $shortcodeTag = 'product';

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
