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
        // TODO: Remove this in upcoming versions
        $this->wpAddAction('init', 'getGlobalCssFromOptions');

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
            wp_enqueue_style('vcv:assets:global:styles:' . $strHelper->slugify($bundleUrl), $bundleUrl);
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
            wp_enqueue_style('vcv:assets:source:main:styles:' . $strHelper->slugify($bundleUrl), $bundleUrl);
        }
    }

    /**
     * @param \VisualComposer\Helpers\Str $strHelper
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
                wp_enqueue_style('vcv:assets:source:styles:' . $strHelper->slugify($asset), $asset);
            }
            unset($asset);
        }

        if (isset($assetsFiles['jsBundles']) && is_array($assetsFiles['jsBundles'])) {
            foreach ($assetsFiles['jsBundles'] as $asset) {
                wp_enqueue_script('vcv:assets:source:scripts:' . $strHelper->slugify($asset), $asset);
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
        $elementsCssData = get_post_meta($sourceId, 'elementsCssData', []);
        $previewElementsBaseCss = [];
        $previewElementsAttributesCss = [];
        $previewElementsMixinsCss = [];
        foreach ($elementsCssData as $postElements) {
            if ($postElements) {
                foreach ($postElements as $element) {
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
        }
        $globalCss = join('', get_post_meta($sourceId, 'globalElementsCss', ''));
        $previewElementsBaseCssContent = join('', array_values($previewElementsBaseCss));
        $previewElementsMixinsCssContent = join('', $previewElementsMixinsCss);
        $previewElementsAttributesCssContent = join('', $previewElementsAttributesCss);

        ?>
        <style id="vcv-preview-global-css"><?php
            echo $previewElementsBaseCssContent . $previewElementsAttributesCssContent
                . $previewElementsMixinsCssContent . $globalCss;
            ?></style>
        <?php
        $sourceCss = get_post_meta($sourceId, 'vcvPreviewSourceCss', true);
        ?>
        <style id="vcv-preview-source-css"><?php echo $sourceCss ?></style><?php
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
                wp_enqueue_style('vcv:assets:source:styles:' . $strHelper->slugify($asset), $asset);
            }
            unset($asset);
        }

        if (isset($assetsFiles['jsBundles']) && is_array($assetsFiles['jsBundles'])) {
            foreach ($assetsFiles['jsBundles'] as $asset) {
                wp_enqueue_script('vcv:assets:source:scripts:' . $strHelper->slugify($asset), $asset);
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
     * Add backward compatible for global css data
     */
    protected function getGlobalCssFromOptions()
    {
        $optionsHelper = vchelper('Options');
        $assetsHelper = vchelper('Assets');

        $globalElementsCssDataUpdated = $optionsHelper->get('globalElementsCssDataUpdated');
        $globalElementsCssData = $optionsHelper->get('globalElementsCssData', []);

        if ('1' !== $globalElementsCssDataUpdated && $globalElementsCssData && is_array($globalElementsCssData)) {
            $globalElementsBaseCss = [];
            $globalElementsAttributesCss = [];
            $globalElementsMixinsCss = [];
            $toRemove = [];

            foreach ($globalElementsCssData as $postId => $postElements) {
                if (get_post($postId)) {
                    if ($postElements) {
                        foreach ($postElements as $element) {
                            $baseCssHash = wp_hash($element['baseCss']);
                            $mixinsCssHash = wp_hash($element['mixinsCss']);
                            $attributesCssHash = wp_hash($element['attributesCss']);
                            $globalElementsBaseCss[ $baseCssHash ] = $element['baseCss'];
                            $globalElementsMixinsCss[ $mixinsCssHash ] = $element['mixinsCss'];
                            $globalElementsAttributesCss[ $attributesCssHash ] = $element['attributesCss'];
                        }
                        update_post_meta($postId, VCV_PREFIX . 'globalElementsCssData', $postElements);
                    }
                } else {
                    $toRemove[] = $postId;
                }
            }

            if (!empty($toRemove)) {
                foreach ($toRemove as $postId) {
                    unset($globalElementsCssData[ $postId ]);
                }
                $optionsHelper->set('globalElementsCssData', $globalElementsCssData);
            }
            $globalElementsBaseCssContent = join('', array_values($globalElementsBaseCss));
            $globalElementsMixinsCssContent = join('', array_values($globalElementsMixinsCss));
            $globalElementsAttributesCssContent = join('', array_values($globalElementsAttributesCss));

            $globalCss = $optionsHelper->get('globalElementsCss', '');
            $globalElementsCss = $globalElementsBaseCssContent . $globalElementsAttributesCssContent
                . $globalElementsMixinsCssContent . $globalCss;
            // Remove previous file
            $previousCssFile = basename($optionsHelper->get('globalElementsCssFileUrl', ''));
            if (!empty($previousCssFile)) {
                $this->removeStaleFile($assetsHelper->getFilePath($previousCssFile));
            }
            $bundleUrl = $assetsHelper->updateBundleFile($globalElementsCss, 'global-elements.css');
            $optionsHelper->set('globalElementsCssFileUrl', $bundleUrl);
            $optionsHelper->set('globalElementsCssDataUpdated', '1');
        }
    }

    protected function removeStaleFile($path)
    {
        $fileHelper = vchelper('File');
        if (!empty($path)) {
            $fileHelper->getFileSystem()->delete($path);
        }
    }
}
