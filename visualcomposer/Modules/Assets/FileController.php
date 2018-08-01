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
use VisualComposer\Helpers\File;
use VisualComposer\Helpers\Frontend;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\PostType;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use WP_Query;

class FileController extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    public function __construct(Frontend $frontendHelper)
    {
        if (!$frontendHelper->isPreview()) {
            /** @see \VisualComposer\Modules\Assets\FileController::generateGlobalElementsCssFile */
            $this->addFilter(
                'vcv:dataAjax:setData vcv:assets:file:generate',
                'generateGlobalElementsCssFile'
            );

            /** @see \VisualComposer\Modules\Assets\FileController::generateSourceCssFile */
            $this->addFilter(
                'vcv:dataAjax:setData',
                'generateSourceCssFile'
            );
        }

        /** @see \VisualComposer\Modules\Assets\FileController::deleteSourceAssetsFile */
        $this->wpAddAction(
            'before_delete_post',
            'deleteSourceAssetsFile'
        );

        /**
         * Migration callback to move globalElements Attribute.css into source.css file
         * @see
         */
        if (vcvenv('VCV_TF_OPTIMIZE_GLOBAL_CSS')) {
            $this->wpAddAction('wp_enqueue_scripts', 'checkGenerateSourceCss');
        }
    }

    /**
     * Generate (save to fs and update db) styles bundle.
     *
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\Options $optionsHelper
     * @param \VisualComposer\Helpers\Assets $assetsHelper
     *
     * @param \VisualComposer\Helpers\File $fileHelper
     *
     * @return bool|string URL to generated bundle.
     */
    protected function generateGlobalElementsCssFile(
        $response,
        $payload,
        Options $optionsHelper,
        Assets $assetsHelper,
        File $fileHelper
    ) {
        $globalElementsBaseCss = [];
        $globalElementsAttributesCss = [];
        $globalElementsMixinsCss = [];
        $additionalPostTypes = vcfilter('vcv:assets:postTypes', ['vcv_templates']);
        $vcvPosts = new WP_Query(
            [
                'post_type' => get_post_types(['exclude_from_search' => false]) + $additionalPostTypes,
                'post_status' => ['publish', 'pending', 'draft', 'auto-draft', 'future', 'private'],
                'posts_per_page' => -1,
                'meta_key' => VCV_PREFIX . 'globalElementsCssData',
                'suppress_filters' => true,
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
                        $globalElementsBaseCss[ $baseCssHash ] = $element['baseCss'];
                        $globalElementsMixinsCss[ $mixinsCssHash ] = $element['mixinsCss'];
                        if (!vcvenv('VCV_TF_OPTIMIZE_GLOBAL_CSS')) {
                            $attributesCssHash = wp_hash($element['attributesCss']);
                            $globalElementsAttributesCss[ $attributesCssHash ] = $element['attributesCss'];
                        }
                    }
                }
            }
        }
        wp_reset_postdata();
        $globalCss = $optionsHelper->get('globalElementsCss', '');

        $globalElementsBaseCssContent = join('', array_values($globalElementsBaseCss));
        $globalElementsMixinsCssContent = join('', array_values($globalElementsMixinsCss));
        if (!vcvenv('VCV_TF_OPTIMIZE_GLOBAL_CSS')) {
            $globalElementsAttributesCssContent = join('', array_values($globalElementsAttributesCss));
            $globalElementsCss = $globalElementsBaseCssContent . $globalElementsAttributesCssContent
                . $globalElementsMixinsCssContent . $globalCss;
        } else {
            $globalElementsCss = $globalElementsBaseCssContent . $globalElementsMixinsCssContent . $globalCss;
        }
        // Remove previous file if possible
        $previousCssFile = basename($optionsHelper->get('globalElementsCssFileUrl', ''));
        $previousCssHash = $optionsHelper->get('globalElementsCssHash', '');
        if (!empty($previousCssFile) && empty($previousCssHash)) {
            $assetsPath = $assetsHelper->getFilePath($previousCssFile);
            if (!empty($assetsPath)) {
                $fileHelper->getFileSystem()->delete($assetsPath);
            }
        }

        $bundleUrl = $assetsHelper->updateBundleFile($globalElementsCss, 'global-elements.css');
        $optionsHelper->set('globalElementsCssFileUrl', $bundleUrl);
        $optionsHelper->set('globalElementsCssHash', md5($globalElementsCss));
        $response['globalBundleCssFileUrl'] = $bundleUrl;

        return $response;
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
        $sourceId = $payload['sourceId'];
        $sourceCss = get_post_meta($sourceId, 'vcvSourceCss', true);
        if (vcvenv('VCV_TF_OPTIMIZE_GLOBAL_CSS')) {
            $globalElementsCssData = get_post_meta($sourceId, VCV_PREFIX . 'globalElementsCssData', true);
            $globalElementsAttributesCss = [];
            if (is_array($globalElementsCssData)) {
                foreach ($globalElementsCssData as $element) {
                    if ($element) {
                        //$baseCssHash = wp_hash($element['baseCss']);
                        //$mixinsCssHash = wp_hash($element['mixinsCss']);
                        $attributesCssHash = wp_hash($element['attributesCss']);
                        //$globalElementsBaseCss[ $baseCssHash ] = $element['baseCss'];
                        // $globalElementsMixinsCss[ $mixinsCssHash ] = $element['mixinsCss'];
                        $globalElementsAttributesCss[ $attributesCssHash ] = $element['attributesCss'];
                    }
                }
            }
            $globalElementsAttributesCssContent = join('', array_values($globalElementsAttributesCss));
            $bundleUrl = $assetsHelper->updateBundleFile(
                $globalElementsAttributesCssContent . $sourceCss,
                $sourceId . '.source.css'
            );
        } else {
            $bundleUrl = $assetsHelper->updateBundleFile(
                $sourceCss,
                $sourceId . '.source.css'
            );
        }
        update_post_meta($sourceId, 'vcvSourceCssFileUrl', $bundleUrl);
        update_post_meta($sourceId, 'vcvSourceCssFileHash', md5($sourceCss));
        $response['sourceBundleCssFileUrl'] = $bundleUrl;

        return $response;
    }

    /**
     * @param \VisualComposer\Helpers\PostType $postTypeHelper
     *
     * @throws \ReflectionException
     */
    protected function checkGenerateSourceCss(PostType $postTypeHelper)
    {
        $sourcePost = $postTypeHelper->get();
        if ($sourcePost && $sourcePost->ID) {
            if (!get_post_meta($sourcePost->ID, VCV_PREFIX . 'globalElementsCssDataMigration', true)) {
                /** @see \VisualComposer\Modules\Assets\FileController::generateSourceCssFile */
                $this->call(
                    'generateSourceCssFile',
                    [
                        'response' => [],
                        'payload' => [
                            'sourceId' => $sourcePost->ID,
                        ],
                    ]
                );
                update_post_meta($sourcePost->ID, VCV_PREFIX . 'globalElementsCssDataMigration', true);
            }
        }
    }

    protected function deleteSourceAssetsFile($sourceId, Assets $assetsHelper)
    {
        $extension = $sourceId . '.source.css';
        $assetsHelper->deleteAssetsBundles($extension);
        vcfilter('vcv:assets:file:generate', []);

        return true;
    }
}
