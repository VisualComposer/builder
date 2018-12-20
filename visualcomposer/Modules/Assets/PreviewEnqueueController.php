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
use VisualComposer\Helpers\Str;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class PreviewEnqueueController extends Container implements Module
{
    use WpFiltersActions;

    public function __construct(Frontend $frontendHelper)
    {
        $actionPriority = 50;
        if ($frontendHelper->isPreview()) {
            $this->wpAddAction('wp_head', 'enqueuePreviewGlobalCss', $actionPriority);
            $this->wpAddAction('wp_head', 'enqueuePreviewAssets', $actionPriority);
        }
    }

    /**
     * Build Css for post preview.
     */
    protected function enqueuePreviewGlobalCss()
    {
        $sourceId = get_the_ID();
        $preview = wp_get_post_autosave($sourceId);
        if (is_object($preview)) {
            $sourceId = $preview->ID;
        }

        $elementsCssData = get_post_meta($sourceId, '_' . VCV_PREFIX . 'previewElementsCssData', true);
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
        $globalCss = get_post_meta($sourceId, '_' . VCV_PREFIX . 'previewGlobalElementsCss', true);
        $previewElementsBaseCssContent = join('', array_values($previewElementsBaseCss));
        $previewElementsMixinsCssContent = join('', $previewElementsMixinsCss);
        $previewElementsAttributesCssContent = join('', $previewElementsAttributesCss);

        $outputGlobalCss = $previewElementsBaseCssContent . $previewElementsAttributesCssContent
            . $previewElementsMixinsCssContent . $globalCss;
        $sourceCss = get_post_meta($sourceId, '_' . VCV_PREFIX . 'previewSourceCss', true);
        $this->printPreviewCss($outputGlobalCss, $sourceCss);
    }

    /**
     * @param \VisualComposer\Helpers\Str $strHelper
     */
    protected function enqueuePreviewAssets(Str $strHelper)
    {
        $sourceId = get_the_ID();
        $preview = wp_get_post_autosave($sourceId);
        if (is_object($preview)) {
            $sourceId = $preview->ID;
        }
        $assetsFiles = get_post_meta($sourceId, '_' . VCV_PREFIX . 'previewSourceAssetsFiles', true);

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
                    ['jquery'],
                    VCV_VERSION,
                    true
                );
            }
            unset($asset);
        }
    }

    /**
     * @param $outputGlobalCss
     * @param $sourceCss
     */
    protected function printPreviewCss($outputGlobalCss, $sourceCss)
    {
        evcview(
            'partials/style',
            [
                'key' => 'preview-global-css',
                'value' => $outputGlobalCss,
            ]
        );
        evcview(
            'partials/style',
            [
                'key' => 'preview-source-css',
                'value' => $sourceCss,
            ]
        );
    }
}
