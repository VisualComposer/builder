<?php

namespace VisualComposer\Modules\Vendors\Plugins;

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
 * Backward compatibility with "WooCommerce Square" plugin.
 *
 * @see https://wordpress.org/plugins/woocommerce-square/
 */
class WooCommerceSquareController extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    /**
     * Static cache that help find if HFS integration already invoke.
     *
     * @var bool
     */
    public static $cacheInvocation = false;

    public function __construct()
    {
        $this->wpAddAction('plugins_loaded', 'initialize', 16);
    }

    protected function initialize()
    {
        if (!class_exists('WooCommerce') || !class_exists('WooCommerce_Square_Loader')) {
            return;
        }

        $this->addFilter(
            'vcv:assets:enqueue:callback:skip',
            function ($result, $payload) {
                $closureInfo = $payload['closureInfo'];
                if ($closureInfo instanceof \ReflectionMethod) {
                    if (
                        !empty($closureInfo->getDeclaringClass()->getName()) &&
                        strpos($closureInfo->getDeclaringClass()->getName(), 'SV_WC_Payment_Gateway')
                    ) {
                        return true;
                    }
                }

                return $result;
            }
        );

        add_action('wp_enqueue_scripts', [$this, 'removeDuplicateEnqueue']);
    }

    /**
     * Remove duplicate enqueue styles for our HFS.
     */
    public function removeDuplicateEnqueue()
    {
        defined('HFS_POST_TYPE_LIST');

        $hfsPostTypeList = [
            'vcv_headers',
            'vcv_footers',
            'vcv_sidebars',
        ];

        if (in_array(get_post_type(), $hfsPostTypeList)) {
            add_filter('wc_gateway_square_credit_card_is_available', function ($isAvailable) {

                if (self::$cacheInvocation) {
                    return false;
                }

                self::$cacheInvocation = true;

                return true;
            }, 10, 1);
        }
    }
}
