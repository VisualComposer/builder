<?php

namespace VisualComposer\Modules\Assets;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Assets;
use VisualComposer\Helpers\AssetsEnqueue;
use VisualComposer\Helpers\Frontend;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Str;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class EnqueueController extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    protected $lastEnqueueIdAssetsAll = [];

    public function __construct(Frontend $frontendHelper)
    {
        $this->wpAddAction('wp_enqueue_scripts', 'enqueueAllAssets', 50);
        $this->addEvent('vcv:assets:enqueueAssets', 'enqueueAssetsVendorListener');
    }

    protected function enqueueAllAssets()
    {
        $this->call('enqueueGlobalAssets');
        $this->call('enqueueAssets');
    }

    /**
     * @param array $sourceIds // IDs to enqueue resources
     */
    protected function enqueueAssetsVendorListener($sourceIds)
    {
        if (empty($sourceIds)) {
            return;
        }
        $sourceIds = array_unique($sourceIds);
        foreach ($sourceIds as $sourceId) {
            if (in_array($sourceId, $this->lastEnqueueIdAssetsAll)) {
                continue;
            }
            $this->call('enqueueSourceAssetsBySourceId', ['sourceId' => $sourceId]);
            $this->call('enqueueAssetsBySourceId', ['sourceId' => $sourceId]);
        }
    }

    /**
     * @param \VisualComposer\Helpers\Options $optionsHelper
     * @param \VisualComposer\Helpers\Str $strHelper
     * @param \VisualComposer\Helpers\Assets $assetsHelper
     */
    protected function enqueueGlobalAssets(
        Options $optionsHelper,
        Str $strHelper,
        Assets $assetsHelper
    ) {
        $bundleUrl = $optionsHelper->get('globalElementsCssFileUrl');
        if ($bundleUrl) {
            $version = $optionsHelper->get('globalElementsChecksum', VCV_VERSION);
            if (!preg_match('/^http/', $bundleUrl)) {
                if (!preg_match('/assets-bundles/', $bundleUrl)) {
                    $bundleUrl = '/assets-bundles/' . $bundleUrl;
                }
            }
            wp_enqueue_style(
                'vcv:assets:global:styles:' . $strHelper->slugify($bundleUrl),
                $assetsHelper->getAssetUrl($bundleUrl),
                [],
                VCV_VERSION . '.' . $version
            );
        }
    }

    /**
     * @param \VisualComposer\Helpers\Frontend $frontendHelper
     */
    protected function enqueueAssets(Frontend $frontendHelper)
    {
        if ($frontendHelper->isPageEditable() && !vcvenv('VCV_FT_INITIAL_CSS_LOAD')) {
            return;
        }
        $sourceId = get_the_ID();
        if ($frontendHelper->isPreview()
            && (!empty($this->lastEnqueueIdAssetsAll)
                || (in_array($sourceId, $this->lastEnqueueIdAssetsAll)))) {
            $this->call('addEnqueuedId', ['sourceId' => $sourceId]);
        } elseif (is_home() || is_archive() || is_category() || is_tag()) {
            // @codingStandardsIgnoreStart
            global $wp_query;
            $wpQuery = $wp_query;
            // @codingStandardsIgnoreEnd
            foreach ($wpQuery->posts as $post) {
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
     * @param $sourceId
     */
    protected function enqueueSourceAssetsBySourceId(Str $strHelper, Assets $assetsHelper, $sourceId = null)
    {
        if (!$sourceId) {
            $sourceId = get_the_ID();
        }
        $this->call('addEnqueuedId', ['sourceId' => $sourceId]);
        $bundleUrl = get_post_meta($sourceId, 'vcvSourceCssFileUrl', true);
        if ($bundleUrl) {
            if (vcvenv('VCV_TF_SOURCE_CSS_CHECKSUM')) {
                $version = get_post_meta($sourceId, '_' . VCV_PREFIX . 'sourceChecksum', true);
            } else {
                $version = get_post_meta($sourceId, 'vcvSourceCssFileHash', true);
            }

            if (!preg_match('/^http/', $bundleUrl)) {
                if (!preg_match('/assets-bundles/', $bundleUrl)) {
                    $bundleUrl = '/assets-bundles/' . $bundleUrl;
                }
            }

            wp_enqueue_style(
                'vcv:assets:source:main:styles:' . $strHelper->slugify($bundleUrl),
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
     * @throws \ReflectionException
     */
    protected function enqueueAssetsBySourceId(
        AssetsEnqueue $assetsEnqueueHelper,
        $sourceId = null
    ) {
        if (!$sourceId) {
            $sourceId = get_the_ID();
        }
        $this->call('addEnqueuedId', ['sourceId' => $sourceId]);

        $assetsEnqueueHelper->enqueueAssets($sourceId);
    }

    /**
     * @param $sourceId
     */
    protected function addEnqueuedId($sourceId)
    {
        if (!in_array($sourceId, $this->lastEnqueueIdAssetsAll)) {
            array_push($this->lastEnqueueIdAssetsAll, $sourceId);
        }
    }
}
