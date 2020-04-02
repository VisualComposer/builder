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

        $this->wpAddAction('wp_footer', 'enqueueAssetsFromList', 9);
        $this->wpAddAction('wp_footer', 'enqueueVcvAssets');
    }

    protected function enqueueAssetsFromList(AssetsEnqueue $assetsEnqueueHelper)
    {
        if (vcvenv('ENQUEUE_INNER_ASSETS')) {
            return;
        }

        foreach ($assetsEnqueueHelper->getEnqueueList() as $sourceId) {
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
                do_action('wp_enqueue_scripts');
                do_action('wp_print_scripts'); // Load localize scripts
                VcvEnv::set('ENQUEUE_INNER_ASSETS', true);
                ob_start();

                // This action needed to add all 3rd party localizations/scripts queue in footer for exact post id
                $this->callNonWordpressActionCallbacks('wp_footer');
                ob_end_clean();
            }
            $wp_query = $backup;
            $wp_the_query = $backupGlobal; // fix wp_reset_query
        }
        wp_reset_postdata();
        VcvEnv::set('ENQUEUE_INNER_ASSETS', false);
    }

    protected function callNonWordpressActionCallbacks($action)
    {
        global $wp_filter;
        // Run over actions sorted by priorities
        $actions = $wp_filter[ $action ]->callbacks;
        ksort($actions);
        foreach ($actions as $priority => $callbacks) {
            // Run over callbacks
            foreach ($callbacks as $callback) {
                $closureInfo = $this->getCallReflector($callback['function']);
                $fileName = $closureInfo->getFileName();

                if (strpos($fileName, WPINC) !== false || strpos($fileName, 'wp-admin') !== false) {
                    continue; // Skip wordpress callback
                }

                // Call the callback
                $callback['function']();
            }
        }
    }

    protected function enqueueVcvAssets()
    {
        $this->enqueueAssetsVendorListener([get_the_ID()]);
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
    protected function enqueueAssets(Frontend $frontendHelper)
    {
        if ($frontendHelper->isPageEditable() && !vcvenv('VCV_FT_INITIAL_CSS_LOAD')) {
            return;
        }
        $sourceId = get_the_ID();
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
        $this->call('enqueueAssetsBySourceId', ['sourceId' => $sourceId]);
        $this->call('enqueueSourceAssetsBySourceId', ['sourceId' => $sourceId]);
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

        if ($optionsHelper->get('globalElementsCss')) {
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
                VCV_VERSION . '.' . $version
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
