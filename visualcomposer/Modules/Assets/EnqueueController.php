<?php

namespace VisualComposer\Modules\Assets;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VcvEnv;
use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Assets;
use VisualComposer\Helpers\AssetsEnqueue;
use VisualComposer\Helpers\Frontend;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Str;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class EnqueueController extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    protected $lastEnqueueIdAssetsAll = [];

    protected $globalCssAdded = false;

    public function __construct(Request $requestHelper)
    {
        $this->wpAddAction('wp_enqueue_scripts', 'enqueueAssets', 50);
        if (
            (defined('DOING_AJAX') && DOING_AJAX)
            || !is_admin()
            || $requestHelper->isAjax()
            || $requestHelper->exists(VCV_ADMIN_AJAX_REQUEST)
        ) {
            $this->wpAddAction('init', 'setCustomWpScripts');
        }
        $this->wpAddAction('wp_footer', 'enqueueAssetsFromList', 11);
        $this->wpAddAction('wp_footer', 'enqueueVcvAssets');

        // Used in 3rd party places, like elements/addons/widgets
        $this->addEvent(
            'vcv:assets:enqueue:css:list',
            function () {
                $this->call(
                    'enqueueAssetsFromList',
                    [
                        'payload' => [
                            'printJs' => false,
                        ],
                    ]
                );
            }
        );
        $this->addEvent(
            'vcv:assets:enqueue:js:list',
            function () {
                $this->call(
                    'enqueueAssetsFromList',
                    [
                        'payload' => [
                            'printJs' => true,
                        ],
                    ]
                );
            }
        );
    }

    protected function enqueueAssetsFromList($payload, AssetsEnqueue $assetsEnqueueHelper)
    {
        // NOTE: This is not an feature toggler, it is local env to avoid recursion
        if (vcvenv('ENQUEUE_INNER_ASSETS')) {
            return;
        }
        VcvEnv::set('ENQUEUE_INNER_ASSETS', true);
        $printJs = isset($payload['printJs']) ? $payload['printJs'] : true;
        $enqueueList = $assetsEnqueueHelper->getEnqueueList();
        if (!empty($enqueueList)) {
            foreach ($enqueueList as $sourceId) {
                // @codingStandardsIgnoreStart
                global $wp_query, $wp_the_query;
                $backup = $wp_query;
                $backupGlobal = $wp_the_query;

                $tempPostQuery = new \WP_Query(
                    [
                        'p' => $sourceId,
                        'post_status' => get_post_status($sourceId),
                        'post_type' => get_post_type($sourceId),
                        'posts_per_page' => 1,
                    ]
                );
                $wp_query = $tempPostQuery;
                $wp_the_query = $tempPostQuery;
                if ($wp_query->have_posts()) {
                    $wp_query->the_post();
                    $this->callNonWordpressActionCallbacks('wp_enqueue_scripts');

                    // queue of assets to be outputted later with print_late_styles() and do_action('wp_print_footer_script')
                    // Output JS only if printJs is true (used to output only CSS)
                    if ($printJs) {
                        $this->callNonWordpressActionCallbacks('wp_print_scripts');
                        $this->callNonWordpressActionCallbacks('wp_print_footer_scripts');
                    }
                    ob_start();
                    if ($printJs) {
                        //fix for WooCommerce Google Analytics Pro plugin
                        add_filter('wc_google_analytics_pro_do_not_track', '__return_true');
                        // This action needed to add all 3rd party localizations/scripts queue in footer for exact post id
                        $this->callNonWordpressActionCallbacks('wp_footer');
                    }
                    ob_end_clean();
                }
                $wp_query = $backup;
                $wp_the_query = $backupGlobal; // fix wp_reset_query
                // Remove from list only if printJs is true (footer side)
                if ($printJs) {
                    $assetsEnqueueHelper->removeFromList($sourceId);
                }
            }
            wp_reset_postdata();
        }
        VcvEnv::set('ENQUEUE_INNER_ASSETS', false);
    }

    protected function callNonWordpressActionCallbacks($action)
    {
        global $wp_filter, $wp_current_filter;
        // Run over actions sorted by priorities
        $actions = $wp_filter[ $action ]->callbacks;
        ksort($actions);
        // @codingStandardsIgnoreLine
        $wp_current_filter[] = $action;
        foreach ($actions as $priority => $callbacks) {
            // Run over callbacks
            foreach ($callbacks as $callback) {
                $closureInfo = $this->getCallReflector($callback['function']);
                // This filter can be used to prevent callback() call in Header/Footer or other parts like global templates
                if (vcfilter(
                    'vcv:assets:enqueue:callback:skip',
                    false,
                    [
                        'closureInfo' => $closureInfo,
                        'callback' => $callback,
                    ]
                )) {
                    continue;
                }
                $fileName = $closureInfo->getFileName();

                if (strpos($fileName, WPINC) !== false || strpos($fileName, 'wp-admin') !== false) {
                    continue; // Skip wordpress callback
                }

                // Call the callback
                call_user_func_array($callback['function'], ['']);
            }
        }
        // @codingStandardsIgnoreLine
        array_pop($wp_current_filter);
    }

    protected function enqueueVcvAssets($sourceIds)
    {
        if (!is_array($sourceIds) || empty($sourceIds)) {
            $sourceIds = [get_the_ID()];
        }
        $this->enqueueAssetsVendorListener($sourceIds);
    }

    protected function setCustomWpScripts()
    {
        // @codingStandardsIgnoreStart
        global $wp_scripts;
        $newScripts = new VcwbWpScripts();
        if (is_object($wp_scripts)) {
            foreach (get_object_vars($wp_scripts) as $key => $value) {
                $newScripts->{$key} = $value;
            }
        }
        $wp_scripts = $newScripts;
        // @codingStandardsIgnoreEnd
    }

    /**
     * @param array $sourceIds // IDs to enqueue resources
     *
     * @throws \ReflectionException
     * @throws \VisualComposer\Framework\Illuminate\Container\BindingResolutionException
     */
    protected function enqueueAssetsVendorListener($sourceIds)
    {
        if (empty($sourceIds)) {
            return;
        }
        $sourceIds = array_unique($sourceIds);
        foreach ($sourceIds as $sourceId) {
            if (in_array($sourceId, $this->lastEnqueueIdAssetsAll, true)) {
                continue;
            }
            $this->call('enqueueSourceAssetsBySourceId', ['sourceId' => $sourceId]);
            $this->call('enqueueAssetsBySourceId', ['sourceId' => $sourceId]);
        }
    }

    /**
     * @param \VisualComposer\Helpers\Frontend $frontendHelper
     *
     * @throws \ReflectionException
     * @throws \VisualComposer\Framework\Illuminate\Container\BindingResolutionException
     */
    protected function enqueueAssets(Frontend $frontendHelper, Assets $assetsHelper)
    {
        $sourceId = get_the_ID();
        wp_enqueue_style('vcv:assets:front:style');
        wp_enqueue_script('vcv:assets:front:script');
        wp_enqueue_script('vcv:assets:runtime:script');
        if (
            $frontendHelper->isPreview()
            && (
                !empty($this->lastEnqueueIdAssetsAll) || (in_array($sourceId, $this->lastEnqueueIdAssetsAll, true))
            )
        ) {
            // To avoid enqueue assets inside preview page
            $this->addEnqueuedId($sourceId);
        } elseif (is_home() || is_archive() || is_category() || is_tag()) {
            // @codingStandardsIgnoreLine
            global $wp_query;
            // @codingStandardsIgnoreLine
            foreach ($wp_query->posts as $post) {
                $this->call('enqueueAssetsBySourceId', ['sourceId' => $post->ID]);
                $this->call('enqueueSourceAssetsBySourceId', ['sourceId' => $post->ID]);
            }
        }
        vcevent('vcv:assets:enqueueVendorAssets');

        $idList = $assetsHelper->getTemplateIds($sourceId);
        if (!empty($idList) && is_array($idList)) {
            foreach ($idList as $sourceId) {
                $this->call('enqueueAssetsBySourceId', ['sourceId' => $sourceId]);
                $this->call('enqueueSourceAssetsBySourceId', ['sourceId' => $sourceId]);
            }
        }
    }

    /**
     * @param \VisualComposer\Helpers\Str $strHelper
     * @param \VisualComposer\Helpers\Assets $assetsHelper
     * @param \VisualComposer\Helpers\Options $optionsHelper
     * @param $sourceId
     *
     * @throws \ReflectionException
     */
    protected function enqueueSourceAssetsBySourceId(
        Str $strHelper,
        Assets $assetsHelper,
        Options $optionsHelper,
        $sourceId = null
    ) {
        if (!$sourceId) {
            $sourceId = get_the_ID();
        }

        if (!get_post_meta($sourceId, '_' . VCV_PREFIX . 'globalCssMigrated', true)) {
            vcevent('vcv:assets:file:generate', ['response' => [], 'payload' => ['sourceId' => $sourceId]]);
        }

        if (!$this->globalCssAdded && $optionsHelper->get('globalElementsCss')) {
            $this->globalCssAdded = true;
            wp_register_style(VCV_PREFIX . 'globalElementsCss', false);
            wp_enqueue_style(VCV_PREFIX . 'globalElementsCss');
            wp_add_inline_style(VCV_PREFIX . 'globalElementsCss', $optionsHelper->get('globalElementsCss'));
        }

        $this->addEnqueuedId($sourceId);
        $bundleUrl = get_post_meta($sourceId, 'vcvSourceCssFileUrl', true);
        if ($bundleUrl) {
            $version = get_post_meta($sourceId, '_' . VCV_PREFIX . 'sourceChecksum', true);

            if (strpos($bundleUrl, 'http') !== 0) {
                if (strpos($bundleUrl, 'assets-bundles') === false) {
                    $bundleUrl = '/assets-bundles/' . $bundleUrl;
                }
            }

            $handle = 'vcv:assets:source:main:styles:' . $strHelper->slugify($bundleUrl);
            wp_enqueue_style(
                $handle,
                $assetsHelper->getAssetUrl($bundleUrl),
                [],
                VCV_VERSION . '.' . $version . '-' . $sourceId
            );
        }
    }

    /**
     * @param \VisualComposer\Helpers\AssetsEnqueue $assetsEnqueueHelper
     * @param $sourceId
     *
     */
    protected function enqueueAssetsBySourceId(
        AssetsEnqueue $assetsEnqueueHelper,
        $sourceId = null
    ) {
        if (!$sourceId) {
            $sourceId = get_the_ID();
        }
        $this->addEnqueuedId($sourceId);

        $assetsEnqueueHelper->enqueueAssets($sourceId);
    }

    /**
     * @param $sourceId
     */
    protected function addEnqueuedId($sourceId)
    {
        if (!in_array($sourceId, $this->lastEnqueueIdAssetsAll, true)) {
            $this->lastEnqueueIdAssetsAll[] = $sourceId;
        }
    }
}
