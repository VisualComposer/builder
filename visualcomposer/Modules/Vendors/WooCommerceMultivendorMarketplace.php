<?php

namespace VisualComposer\Modules\Vendors;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;


/**
 * Backward compatibility with WooCommerce Multivendor Marketplace plugin.
 *
 * @see https://wordpress.org/plugins/wc-multivendor-marketplace
 */
class WooCommerceMultivendorMarketplace extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    public function __construct()
    {
        $this->wpAddAction('plugins_loaded', 'initialize');
    }

    protected function initialize()
    {
        if (!class_exists('WCFMmp')) {
            return;
        }

        $this->addFilter(
            'vcv:editor:settings:pageTemplatesLayouts:fallbackTemplate',
            'disableFallbackTemplate'
        );
    }

    /**
     * We should disable our fallback template cos these plugins includes directly
     * templates on 'template_include' wp action
     *
     * @see WCFMmp_Rewrites::store_template
     *
     * @param bool $response
     *
     * @return bool
     */
    protected function disableFallbackTemplate($response)
    {
        if (function_exists('wcfm_get_option')) {
            $storeUrl = wcfm_get_option('wcfm_store_url', 'store');
        } else {
            $storeUrl = get_option('wcfm_store_url', 'store');
        }

        $storeName = get_query_var($storeUrl);
        if (!empty($storeName)) {
            $response = false;
        }

        return $response;
    }
}
