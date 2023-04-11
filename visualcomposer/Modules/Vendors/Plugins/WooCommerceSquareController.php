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
            'removePluginActionsForOurPostTypes',
            10
        );

        add_action('wp_enqueue_scripts', [$this, 'removeDuplicateEnqueueForHfs'], 30, 1);
        add_action('wp_enqueue_scripts', [$this, 'removeDuplicateEnqueueForGlobalHf'], 30, 1);
        add_action('wp_enqueue_scripts', [$this, 'removeEnqueueForGlobalBlockThemeHf'], 30, 1);
        add_action('wp_enqueue_scripts', [$this, 'removeEnqueueForGlobalLayouts'], 30, 1);
    }

    /**
     * Remove woocommerce square plugin actions for our post types.
     *
     * @param bool $result
     * @param array $payload
     *
     * @return bool
     */
    public function removePluginActionsForOurPostTypes($result, $payload)
    {
        $closureInfo = $payload['closureInfo'];
        if (! $closureInfo instanceof \ReflectionMethod) {
            return $result;
        }

        if (
            !empty($closureInfo->getDeclaringClass()->getName()) &&
            strpos($closureInfo->getDeclaringClass()->getName(), 'SV_WC_Payment_Gateway') ||
            strpos($closureInfo->getDeclaringClass()->getName(), 'Square\Framework\PaymentGateway\Payment_Gateway')
        ) {
            return true;
        }

        return $result;
    }

    /**
     * Remove duplicate enqueue styles for our HFS.
     */
    public function removeDuplicateEnqueueForHfs()
    {
        $hfsPostTypeList = [
            'vcv_headers',
            'vcv_footers',
            'vcv_sidebars',
        ];

        if (in_array(get_post_type(), $hfsPostTypeList)) {
            $this->activateRemovingAction();
        }
    }

    /**
     * Remove duplicate enqueue for our global header/footer.
     */
    public function removeDuplicateEnqueueForGlobalHf()
    {
        $optionsHelper = vchelper('Options');

        $globalHfSetting = $optionsHelper->get('headerFooterSettings');

        if ($globalHfSetting !== 'allSite') {
            return;
        }

        $globalFooter = $optionsHelper->get('headerFooterSettingsAllFooter');
        $globalHeader = $optionsHelper->get('headerFooterSettingsAllHeader');

        if (empty($globalFooter) && empty($globalHeader)) {
            $this->activateRemovingAction();
        }

        if (!empty($globalFooter) && empty($globalHeader)) {
            $this->activateRemovingAction();
        }
    }

    /**
     * Fire up woocommerce square plugin credit card action.
     */
    public function activateRemovingAction()
    {
        add_filter('wc_gateway_square_credit_card_is_available', function ($isAvailable) {

            if (self::$cacheInvocation) {
                return false;
            }

            self::$cacheInvocation = true;

            return $isAvailable;
        }, 10, 1);
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
