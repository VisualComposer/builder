<?php

namespace VisualComposer\Modules\Vendors;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class WooCommerceController extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    public function __construct()
    {
        $this->wpAddAction('plugins_loaded', 'initialize', 16);
    }

    protected function initialize(Request $requestHelper)
    {
        if (!class_exists('WooCommerce')) {
            return;
        }

        $this->addFilter('vcv:themeEditor:headersFootersSettings:addPages', 'addPages');
    }

    /**
     * @param $pages
     *
     * @return mixed
     */
    protected function addPages($pages)
    {
        $pages[] = [
            'title' => __('Woocommerce Shop', 'vcwb'),
            'name' => 'woocommerce-shop',
        ];
        $pages[] = [
            'title' => __('Woocommerce Cart', 'vcwb'),
            'name' => 'woocommerce-cart',
        ];
        $pages[] = [
            'title' => __('Woocommerce Checkout', 'vcwb'),
            'name' => 'woocommerce-checkout',
        ];
        $pages[] = [
            'title' => __('Woocommerce My Account', 'vcwb'),
            'name' => 'woocommerce-account',
        ];

        return $pages;
    }
}
