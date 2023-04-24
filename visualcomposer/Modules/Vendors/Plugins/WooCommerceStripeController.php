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
 * @see https://wordpress.org/plugins/woocommerce-gateway-stripe
 */
class WooCommerceStripeController extends Container implements Module
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
        if (!class_exists('WooCommerce') || !defined('WC_STRIPE_VERSION')) {
            return;
        }

        add_action('wp_enqueue_scripts', [$this, 'removeEnqueueForGlobalBlockThemeHf'], 30, 1);
        add_action('wp_enqueue_scripts', [$this, 'removeEnqueueForGlobalLayouts'], 30, 1);
    }

    /**
     * For a block theme we should process additional script removing action.
     */
    public function removeEnqueueForGlobalBlockThemeHf()
    {
        if (!function_exists('wp_is_block_theme') || !wp_is_block_theme()) {
            return;
        }

        $this->activateSkipping();
    }

    /**
     * For our layouts we should process additional script removing action.
     */
    public function removeEnqueueForGlobalLayouts()
    {
        if (get_post_type() !== 'vcv_layouts') {
            return;
        }

        $this->activateSkipping();
    }

    /**
     * Skipping plugin action.
     */
    public function activateSkipping()
    {
        $this->addFilter(
            'vcv:assets:enqueue:callback:skip',
            function ($result, $payload) {
                $closureInfo = $payload['closureInfo'];

                if ($closureInfo instanceof \ReflectionMethod) {
                    if (
                        !empty($closureInfo->name) &&
                        $closureInfo->name == 'localize_printed_scripts'
                    ) {
                        return true;
                    }
                }

                return $result;
            }
        );
    }
}
