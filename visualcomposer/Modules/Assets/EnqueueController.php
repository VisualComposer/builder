<?php

namespace VisualComposer\Modules\Assets;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Frontend;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Str;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class EnqueueController extends Container implements Module
{
    use WpFiltersActions;

    public function __construct()
    {
        $actionPriority = 50;
        $requestHelper = vchelper('Request');
        if ($requestHelper->input('preview', '') === 'true') {
            $this->wpAddAction('wp_head', 'enqueuePreviewGlobalCss', $actionPriority);
            $this->wpAddAction('wp_head', 'enqueuePreviewAssets', $actionPriority);

            return;
        }
        $this->wpAddAction('wp_enqueue_scripts', 'enqueueGlobalAssets', $actionPriority);

        /** @see \VisualComposer\Modules\Assets\EnqueueController::enqueueAssets */
        $this->wpAddAction('wp_enqueue_scripts', 'enqueueAssets', $actionPriority);

        $this->wpAddAction('wp_enqueue_scripts', 'enqueueSourceAssets', $actionPriority);

        $this->wpAddFilter('language_attributes', 'addNoJs', $actionPriority);
    }

    /**
     * @param \VisualComposer\Helpers\Options $optionsHelper
     * @param \VisualComposer\Helpers\Str $strHelper
     * @param \VisualComposer\Helpers\Frontend $frontendHelper
     */
    protected function enqueueGlobalAssets(Options $optionsHelper, Str $strHelper, Frontend $frontendHelper)
    {
        $bundleUrl = $optionsHelper->get('globalElementsCssFileUrl');
        if ($bundleUrl && !$frontendHelper->isPageEditable()) {
            $version = $optionsHelper->get('globalElementsCssHash', VCV_VERSION);
            wp_enqueue_style(
                'vcv:assets:global:styles:' . $strHelper->slugify($bundleUrl),
                $bundleUrl,
                [],
                VCV_VERSION . '.' . $version
            );
        }
    }

    /**
     * @param \VisualComposer\Helpers\Str $strHelper
     * @param \VisualComposer\Helpers\Frontend $frontendHelper
     */
    protected function enqueueSourceAssets(Str $strHelper, Frontend $frontendHelper)
    {
        $sourceId = get_the_ID();
        $bundleUrl = get_post_meta($sourceId, 'vcvSourceCssFileUrl', true);
        if ($bundleUrl && !$frontendHelper->isPageEditable()) {
            $version = get_post_meta($sourceId, 'vcvSourceCssFileHash', true);

            wp_enqueue_style(
                'vcv:assets:source:main:styles:' . $strHelper->slugify($bundleUrl),
                $bundleUrl,
                [],
                VCV_VERSION . '.' . $version
            );
        }
    }

    /**
     * @param \VisualComposer\Helpers\Str $strHelper
     * @param \VisualComposer\Helpers\Frontend $frontendHelper
     */
    protected function enqueueAssets(Str $strHelper, Frontend $frontendHelper)
    {
        if ($frontendHelper->isPageEditable()) {
            return;
        }
        $sourceId = get_the_ID();
        $assetsFiles = get_post_meta($sourceId, 'vcvSourceAssetsFiles', true);

        if (!is_array($assetsFiles)) {
            return;
        }

        if (isset($assetsFiles['cssBundles']) && is_array($assetsFiles['cssBundles'])) {
            foreach ($assetsFiles['cssBundles'] as $asset) {
                wp_enqueue_style('vcv:assets:source:styles:' . $strHelper->slugify($asset), $asset, [], VCV_VERSION);
            }
            unset($asset);
        }

        if (isset($assetsFiles['jsBundles']) && is_array($assetsFiles['jsBundles'])) {
            foreach ($assetsFiles['jsBundles'] as $asset) {
                wp_enqueue_script(
                    'vcv:assets:source:scripts:' . $strHelper->slugify($asset),
                    $asset,
                    [],
                    VCV_VERSION,
                    true
                );
            }
            unset($asset);
        }
    }

    /**
     * Build Css for post preview.
     */
    protected function enqueuePreviewGlobalCss()
    {
        $sourceId = get_the_ID();
        $elementsCssData = get_post_meta($sourceId, 'elementsCssData', true);
        $previewElementsBaseCss = [];
        $previewElementsAttributesCss = [];
        $previewElementsMixinsCss = [];
        if ($elementsCssData) {
            foreach ($elementsCssData as $element) {
                if (isset($element['baseCss'])) {
                    $baseCssHash = wp_hash($element['baseCss']);
                    $previewElementsBaseCss[ $baseCssHash ] = $element['baseCss'];
                }
                if (isset($element['mixinsCss'])) {
                    $previewElementsMixinsCss[] = $element['mixinsCss'];
                }
                if (isset($element['attributesCss'])) {
                    $previewElementsAttributesCss[] = $element['attributesCss'];
                }
            }
        }
        $globalCss = get_post_meta($sourceId, 'globalElementsCss', true);
        $previewElementsBaseCssContent = join('', array_values($previewElementsBaseCss));
        $previewElementsMixinsCssContent = join('', $previewElementsMixinsCss);
        $previewElementsAttributesCssContent = join('', $previewElementsAttributesCss);

        $outputGlobalCss = $previewElementsBaseCssContent . $previewElementsAttributesCssContent
            . $previewElementsMixinsCssContent . $globalCss;
        $sourceCss = get_post_meta($sourceId, 'vcvPreviewSourceCss', true);
        $this->printPreviewCss($outputGlobalCss, $sourceCss);
    }

    /**
     * @param \VisualComposer\Helpers\Str $strHelper
     */
    protected function enqueuePreviewAssets(Str $strHelper)
    {
        $sourceId = get_the_ID();
        $assetsFiles = get_post_meta($sourceId, 'vcvPreviewSourceAssetsFiles', true);

        if (!is_array($assetsFiles)) {
            return;
        }

        if (isset($assetsFiles['cssBundles']) && is_array($assetsFiles['cssBundles'])) {
            foreach ($assetsFiles['cssBundles'] as $asset) {
                wp_enqueue_style('vcv:assets:source:styles:' . $strHelper->slugify($asset), $asset, [], VCV_VERSION);
            }
            unset($asset);
        }

        if (isset($assetsFiles['jsBundles']) && is_array($assetsFiles['jsBundles'])) {
            foreach ($assetsFiles['jsBundles'] as $asset) {
                wp_enqueue_script(
                    'vcv:assets:source:scripts:' . $strHelper->slugify($asset),
                    $asset,
                    [],
                    VCV_VERSION,
                    true
                );
            }
            unset($asset);
        }
    }

    protected function addNoJs($output)
    {
        $output .= ' data-vcv-no-js="true" ';

        return $output;
    }

    /**
     * @param $outputGlobalCss
     * @param $sourceCss
     */
    protected function printPreviewCss($outputGlobalCss, $sourceCss)
    {
        echo vcview(
            'partials/style',
            [
                'key' => 'preview-global-css',
                'value' => $outputGlobalCss,
            ]
        );
        echo vcview(
            'partials/style',
            [
                'key' => 'preview-source-css',
                'value' => $sourceCss,
            ]
        );
    }
}
