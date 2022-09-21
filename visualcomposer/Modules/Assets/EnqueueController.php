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
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use WP_Query;

class EnqueueController extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    protected $lastEnqueueIdAssetsAll = [];

    protected $globalCssAdded = false;

    protected static $initialPostId = null;

    protected static $initialEnqueue = null;

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
        $this->wpAddAction('wp_head', 'enqueueNoscript');

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

    /**
     * @throws \ReflectionException
     */
    protected function enqueueAssetsFromList($payload, AssetsEnqueue $assetsEnqueueHelper)
    {
        // NOTE: This is not a feature toggle, it is local env to avoid recursion
        if (vcvenv('ENQUEUE_INNER_ASSETS')) {
            return;
        }
        $globalsHelper = vchelper('Globals');
        VcvEnv::set('ENQUEUE_INNER_ASSETS', true);
        $printJs = !isset($payload['printJs']) || $payload['printJs'];
        $enqueueList = $assetsEnqueueHelper->getEnqueueList();
        if (!empty($enqueueList)) {
            foreach ($enqueueList as $sourceId) {
                $backup = $globalsHelper->get('wp_query');
                $backupGlobal = $globalsHelper->get('wp_the_query');

                $tempPostQuery = new WP_Query(
                    [
                        'p' => $sourceId,
                        'post_status' => get_post_status($sourceId),
                        'post_type' => get_post_type($sourceId),
                        'posts_per_page' => 1,
                    ]
                );
                $globalsHelper->set('wp_query', $tempPostQuery);
                if (is_null(self::$initialPostId)) {
                    self::$initialPostId = get_the_ID();
                }
                $globalsHelper->set('wp_the_query', $tempPostQuery);
                if ($tempPostQuery->have_posts()) {
                    $tempPostQuery->the_post();
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
                $globalsHelper->set('wp_query', $backup);
                $globalsHelper->set('wp_the_query', $backupGlobal);
                // Remove from list only if printJs is true (footer side)
                if ($printJs) {
                    $assetsEnqueueHelper->removeFromList($sourceId);
                }
            }
            wp_reset_postdata();
        }

        $assetsEnqueueHelper->enqueuePageSettingsCss(get_the_ID());

        VcvEnv::set('ENQUEUE_INNER_ASSETS', false);
    }

    /**
     * @throws \ReflectionException
     */
    protected function callNonWordpressActionCallbacks($action)
    {
        global $wp_filter;
        // Run over actions sorted by priorities
        $actions = $wp_filter[ $action ]->callbacks;
        ksort($actions);
        $globalsHelper = vchelper('Globals');
        $currentFilterCopy = $globalsHelper->get('wp_current_filter');
        $currentFilterCopy[] = $action;
        $globalsHelper->set('wp_current_filter', $currentFilterCopy);
        foreach ($actions as $callbacks) {
            // Run over callbacks
            foreach ($callbacks as $callback) {
                $closureInfo = $this->getCallReflector($callback['function']);
                // This filter can be used to prevent callback() call in Header/Footer or other parts like global templates
                if (
                    vcfilter(
                        'vcv:assets:enqueue:callback:skip',
                        false,
                        [
                            'closureInfo' => $closureInfo,
                            'callback' => $callback,
                        ]
                    )
                ) {
                    continue;
                }
                $fileName = $closureInfo->getFileName();

                if (strpos($fileName, WPINC) !== false || strpos($fileName, 'wp-admin') !== false) {
                    continue; // Skip WordPress callback
                }

                // Call the callback
                call_user_func_array($callback['function'], ['']);
            }
        }
        $currentFilterCopy = $globalsHelper->get('wp_current_filter');
        array_pop($currentFilterCopy);
        $globalsHelper->set('wp_current_filter', $currentFilterCopy);
    }

    protected function enqueueVcvAssets($sourceIds)
    {
        if (!is_array($sourceIds) || empty($sourceIds)) {
            $sourceIds = [get_the_ID()];
        }
        $this->enqueueAssetsVendorListener($sourceIds);
    }

    protected function enqueueNoscript()
    {
        echo '<noscript><style>.vce-row-container .vcv-lozad {display: none}</style></noscript>';
    }

    protected function setCustomWpScripts()
    {
        global $wp_scripts;
        $newScripts = new VcwbWpScripts();
        if (is_object($wp_scripts)) {
            foreach (get_object_vars($wp_scripts) as $key => $value) {
                $newScripts->{$key} = $value;
            }
        }
        $globalsHelper = vchelper('Globals');
        $globalsHelper->set('wp_scripts', $newScripts);
    }

    /**
     * @param array $sourceIds // IDs to enqueue resources
     */
    protected function enqueueAssetsVendorListener($sourceIds)
    {
        if (empty($sourceIds)) {
            return;
        }

        if (is_null(self::$initialPostId)) {
            self::$initialPostId = get_the_ID();
        }

        $sourceIds = array_unique($sourceIds);
        $this->enqueueAssetsBySourceList($sourceIds);
    }

    /**
     * Process list ids by source stack enqueues.
     *
     * @param array $sourceIdList
     */
    protected function enqueueAssetsBySourceList($sourceIdList)
    {
        if (empty($sourceIdList) || !is_array($sourceIdList)) {
            return;
        }

        foreach ($sourceIdList as $sourceId) {
            $isCurrentIdAlreadyEnqueued = in_array($sourceId, $this->lastEnqueueIdAssetsAll, true);
            if ($isCurrentIdAlreadyEnqueued) {
                continue;
            }

            $this->lastEnqueueIdAssetsAll[] = $sourceId;

            $this->call('enqueueAssetsBySourceId', ['sourceId' => $sourceId]);
            $this->call('enqueueSourceAssetsBySourceId', ['sourceId' => $sourceId]);
        }
    }

    /**
     * @param \VisualComposer\Helpers\Assets $assetsHelper
     *
     * @throws \ReflectionException
     * @throws \VisualComposer\Framework\Illuminate\Container\BindingResolutionException
     */
    protected function enqueueAssets(Assets $assetsHelper, Frontend $frontendHelper)
    {
        // Needed to keep proper ordering for layout styles rendering (background images)
        if (is_null(self::$initialEnqueue)) {
            self::$initialEnqueue = true;
            $this->call('enqueueAssetsFromList');
        }
        // @codingStandardsIgnoreLine
        global $wp_query;

        if ($frontendHelper->isVcvFrontend()) {
            wp_enqueue_style('vcv:assets:front:style');
            wp_enqueue_script('vcv:assets:runtime:script');
            wp_enqueue_script('vcv:assets:front:script');
        }

        if (is_home() || is_archive()) {
            $idList = [];
            // @codingStandardsIgnoreLine
            foreach ($wp_query->posts as $post) {
                $idList[] = $post->ID;
            }

            $this->enqueueAssetsBySourceList($idList);
        }
        vcevent('vcv:assets:enqueueVendorAssets');

        $sourceId = get_the_ID();
        $idList = $assetsHelper->getTemplateIds($sourceId);
        $this->enqueueAssetsBySourceList($idList);
    }

    /**
     * @param \VisualComposer\Helpers\AssetsEnqueue $assetsEnqueueHelper
     * @param \VisualComposer\Helpers\Options $optionsHelper
     * @param $sourceId
     *
     */
    protected function enqueueSourceAssetsBySourceId(
        AssetsEnqueue $assetsEnqueueHelper,
        Options $optionsHelper,
        $sourceId = null
    ) {
        if (!$sourceId) {
            $sourceId = get_the_ID();
        }

        if (!get_post_meta($sourceId, '_' . VCV_PREFIX . 'globalCssMigrated', true)) {
            vcevent('vcv:assets:file:generate', ['response' => [], 'payload' => ['sourceId' => $sourceId]]);
        }

        $this->enqueueGlobalCss();

        $bundleUrl = get_post_meta($sourceId, 'vcvSourceCssFileUrl', true);
        if ($bundleUrl) {
            if (strpos($bundleUrl, 'http') !== 0) {
                if (strpos($bundleUrl, 'assets-bundles') === false) {
                    $bundleUrl = '/assets-bundles/' . $bundleUrl;
                }
            }

            $path = VCV_PLUGIN_ASSETS_DIR_PATH . $bundleUrl;
            $fileContent = '';
            $fileHelper = vchelper('File');
            if ($fileHelper->exists($path)) {
                $fileContent = $fileHelper->getContents($path);
            } // todo: regenerate if not exists
            wp_register_style('vcv:assets:front:style:' . $sourceId, false);
            wp_enqueue_style('vcv:assets:front:style:' . $sourceId);
            wp_add_inline_style(
                'vcv:assets:front:style:' . $sourceId,
                vcfilter('vcv:assets:source:main:styles', $fileContent, [
                    'sourceId' => $sourceId,
                    'bundleUrl' => $bundleUrl,
                ])
            );
        }

        if (is_null(self::$initialPostId)) {
            $enqueueList = $assetsEnqueueHelper->getEnqueueList();
            $styles = get_post_meta(
                self::$initialPostId,
                '_' . VCV_PREFIX . 'pageDesignOptionsCompiledCss',
                true
            );
            if (!$enqueueList || !$styles) {
                $assetsEnqueueHelper->enqueuePageSettingsCss($sourceId);
            }
        } else {
            $assetsEnqueueHelper->enqueuePageSettingsCss($sourceId);
        }
    }

    /**
     * Enqueue global css styles.
     */
    protected function enqueueGlobalCss()
    {
        $frontendHelper = vchelper('Frontend');
        // we add it only on frontend view
        if ($frontendHelper->isPageEditable()) {
            return;
        }

        $optionsHelper = vchelper('Options');
        if ($this->globalCssAdded) {
            return;
        }

        $globalCssList = $optionsHelper->get('globalElementsCss');

        if (!$globalCssList) {
            return;
        }

        $this->globalCssAdded = true;
        wp_register_style(VCV_PREFIX . 'globalElementsCss', false);
        wp_enqueue_style(VCV_PREFIX . 'globalElementsCss');
        wp_add_inline_style(VCV_PREFIX . 'globalElementsCss', $globalCssList);
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

        $assetsEnqueueHelper->enqueueAssets($sourceId);
    }
}
