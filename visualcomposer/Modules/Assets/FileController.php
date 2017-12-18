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
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use WP_Query;

class FileController extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Assets\FileController::setData */
        $this->addFilter(
            'vcv:dataAjax:setData vcv:assets:file:generate',
            'generateGlobalElementsCssFile'
        );

        /** @see \VisualComposer\Modules\Assets\FileController::setData */
        $this->addFilter(
            'vcv:dataAjax:setData',
            'generateSourceCssFile'
        );

        /** @see \VisualComposer\Modules\Assets\FileController::deleteSourceAssetsFile */
        $this->wpAddAction(
            'before_delete_post',
            'deleteSourceAssetsFile'
        );

        // TODO: Remove this in upcoming versions (18-dec)
        $this->wpAddAction('init', 'updateGlobalCssFromOptions');
    }

    /**
     * Generate (save to fs and update db) styles bundle.
     *
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @param \VisualComposer\Helpers\Assets $assetsHelper
     *
     * @return bool|string URL to generated bundle.
     */
    protected function generateGlobalElementsCssFile($response, $payload, Options $optionsHelper, Assets $assetsHelper)
    {
        $requestHelper = vchelper('Request');
        if ($requestHelper->input('wp-preview', '') === 'dopreview') {
            return $response;
        }

        $globalElementsBaseCss = [];
        $globalElementsAttributesCss = [];
        $globalElementsMixinsCss = [];
        $vcvPosts = new WP_Query(
            [
                'post_type' => 'any',
                'post_status' => ['publish', 'pending', 'draft', 'auto-draft', 'future', 'private'],
                'posts_per_page' => -1,
                'meta_key' => VCV_PREFIX . 'globalElementsCssData',
            ]
        );

        while ($vcvPosts->have_posts()) {
            $vcvPosts->the_post();
            $globalElementsCssData = get_post_meta(get_the_ID(), VCV_PREFIX . 'globalElementsCssData', true);
            if (is_array($globalElementsCssData)) {
                foreach ($globalElementsCssData as $element) {
                    if ($element) {
                        $baseCssHash = wp_hash($element['baseCss']);
                        $mixinsCssHash = wp_hash($element['mixinsCss']);
                        $attributesCssHash = wp_hash($element['attributesCss']);
                        $globalElementsBaseCss[ $baseCssHash ] = $element['baseCss'];
                        $globalElementsMixinsCss[ $mixinsCssHash ] = $element['mixinsCss'];
                        $globalElementsAttributesCss[ $attributesCssHash ] = $element['attributesCss'];
                    }
                }
            }
        }
        wp_reset_postdata();

        $globalElementsBaseCssContent = join('', array_values($globalElementsBaseCss));
        $globalElementsMixinsCssContent = join('', array_values($globalElementsMixinsCss));
        $globalElementsAttributesCssContent = join('', array_values($globalElementsAttributesCss));

        $globalCss = $optionsHelper->get('globalElementsCss', '');
        $globalElementsCss = $globalElementsBaseCssContent . $globalElementsAttributesCssContent
            . $globalElementsMixinsCssContent . $globalCss;

        // Remove previous file if possible
        $previousCssFile = basename($optionsHelper->get('globalElementsCssFileUrl', ''));
        $previousCssHash = $optionsHelper->get('globalElementsCssHash', '');
        if (!empty($previousCssFile) && empty($previousCssHash)) {
            $assetsPath = $assetsHelper->getFilePath($previousCssFile);
            $this->removeStaleFile($assetsPath);
        }

        $bundleUrl = $assetsHelper->updateBundleFile($globalElementsCss, 'global-elements.css');
        $optionsHelper->set('globalElementsCssFileUrl', $bundleUrl);
        $optionsHelper->set('globalElementsCssHash', md5($globalElementsCss));
        $response['globalBundleCssFileUrl'] = $bundleUrl;

        return $response;
    }

    protected function removeStaleFile($path)
    {
        $fileHelper = vchelper('File');
        if (!empty($path)) {
            $fileHelper->getFileSystem()->delete($path);
        }
    }

    /**
     *
     * Generate (save to fs and update db) post styles bundle.
     *
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\Assets $assetsHelper
     *
     * @return bool|string URL to generated bundle.
     *
     */
    protected function generateSourceCssFile($response, $payload, Assets $assetsHelper)
    {
        $requestHelper = vchelper('Request');
        if ($requestHelper->input('wp-preview', '') === 'dopreview') {
            return $response;
        }
        $sourceId = $payload['sourceId'];
        $sourceCss = get_post_meta($sourceId, 'vcvSourceCss', true);
        $bundleUrl = $assetsHelper->updateBundleFile($sourceCss, $sourceId . '.source.css');
        update_post_meta($sourceId, 'vcvSourceCssFileUrl', $bundleUrl);
        update_post_meta($sourceId, 'vcvSourceCssFileHash', md5($sourceCss));
        $response['sourceBundleCssFileUrl'] = $bundleUrl;

        return $response;
    }

    protected function deleteSourceAssetsFile($sourceId, Assets $assetsHelper)
    {
        $extension = $sourceId . '.source.css';
        $assetsHelper->deleteAssetsBundles($extension);
        vcfilter('vcv:assets:file:generate', []);

        return true;
    }

    /**
     * Add backward compatible for global css data
     * @todo remove few releases later (18-dec)
     */
    protected function updateGlobalCssFromOptions()
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

            $this->removeGlobalElementsCssData($toRemove);
            $globalElementsBaseCssContent = join('', array_values($globalElementsBaseCss));
            $globalElementsMixinsCssContent = join('', array_values($globalElementsMixinsCss));
            $globalElementsAttributesCssContent = join('', array_values($globalElementsAttributesCss));

            $globalCss = $optionsHelper->get('globalElementsCss', '');
            $globalElementsCss = $globalElementsBaseCssContent . $globalElementsAttributesCssContent
                . $globalElementsMixinsCssContent . $globalCss;
            // Remove previous file
            $previousCssFile = basename($optionsHelper->get('globalElementsCssFileUrl', ''));
            $previousCssHash = $optionsHelper->get('globalElementsCssHash', '');
            if (!empty($previousCssFile) && empty($previousCssHash)) {
                $assetsPath = $assetsHelper->getFilePath($previousCssFile);
                $this->removeStaleFile($assetsPath);
            }
            $bundleUrl = $assetsHelper->updateBundleFile($globalElementsCss, 'global-elements.css');
            $optionsHelper->set('globalElementsCssFileUrl', $bundleUrl);
            $optionsHelper->set('globalElementsCssDataUpdated', '1');
            $optionsHelper->set('globalElementsCssHash', md5($globalElementsCss));
        }
    }

    /**
     * @todo remove few releases later (18-dec)
     *
     * @param $toRemove
     */
    protected function removeGlobalElementsCssData($toRemove)
    {
        $optionsHelper = vchelper('Options');
        $globalElementsCssData = $optionsHelper->get('globalElementsCssData', []);
        if (!empty($toRemove)) {
            foreach ($toRemove as $postId) {
                unset($globalElementsCssData[ $postId ]);
            }
            $optionsHelper->set('globalElementsCssData', $globalElementsCssData);
        }
    }
}
