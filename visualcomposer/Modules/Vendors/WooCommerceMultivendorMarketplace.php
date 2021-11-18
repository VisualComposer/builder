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

        $this->addFilter('vcv:editor:settings:pageTemplatesLayouts:fallbackTemplate',
            function() {
            return false;
        });
    }
}
