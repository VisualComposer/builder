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
                'vcv:dataAjax:setData',
                'generateGlobalElementsCssFile'
            );
            /** @see \VisualComposer\Modules\Assets\FileController::generateGlobalElementsCssFile */
            $this->addEvent(
                'vcv:assets:file:generate',
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
        $this->wpAddAction('wp_enqueue_scripts', 'checkGenerateSourceCss');
    }

    /**
     * Generate (save to fs and update db) styles bundle.
     *
     * @param $response
     * @param \VisualComposer\Helpers\Options $optionsHelper
     * @param \VisualComposer\Helpers\Assets $assetsHelper
     *
     * @param \VisualComposer\Helpers\File $fileHelper
     *
     * @return bool|string URL to generated bundle.
     */
    protected function generateGlobalElementsCssFile(
        $response,
        Options $optionsHelper,
        Assets $assetsHelper,
        File $fileHelper
    ) {
        $globalElementsBaseCss = [];
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
                    }
                }
            }
        }
        wp_reset_postdata();
        $globalCss = $optionsHelper->get('globalElementsCss', '');

        $globalElementsBaseCssContent = join('', array_values($globalElementsBaseCss));
        $globalElementsMixinsCssContent = join('', array_values($globalElementsMixinsCss));
        $globalElementsCss = $globalElementsBaseCssContent . $globalElementsMixinsCssContent . $globalCss;

        if (vcvenv('VCV_TF_CSS_CHECKSUM')) {
            $globalElementsChecksum = wp_hash($globalElementsCss);
            $oldGlobalElementsChecksum = $optionsHelper->get('globalElementsChecksum');

            $globalElementsName = 'global-elements-' . $globalElementsChecksum . '.css';

            $bundleUrl = $assetsHelper->updateBundleFile(
                $globalElementsCss,
                $globalElementsName
            );

            if ($globalElementsChecksum !== $oldGlobalElementsChecksum) {
                $globalElementsPath = $assetsHelper->getFilePath($globalElementsName);
                if ($fileHelper->isFile($globalElementsPath)) {
                    $assetsHelper->deleteAssetsBundles('global-elements-' . $oldGlobalElementsChecksum . '.css');
                    $optionsHelper->set('globalElementsChecksum', $globalElementsChecksum);

                    //remove old global-elements.css file
                    $globalElementsPath = $assetsHelper->getFilePath('global-elements.css');
                    if ($fileHelper->isFile($globalElementsPath)) {
                        $assetsHelper->deleteAssetsBundles('global-elements.css');
                    }
                }
            }
        } else {
            $bundleUrl = $this->parseGlobalElementsCssFile(
                $optionsHelper,
                $assetsHelper,
                $fileHelper,
                $globalElementsCss
            );
        }
        $optionsHelper->set('globalElementsCssFileUrl', $bundleUrl);
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
     * @param \VisualComposer\Helpers\File $fileHelper
     *
     * @return bool|string URL to generated bundle.
     * @throws \ReflectionException
     */
    protected function generateSourceCssFile($response, $payload, Assets $assetsHelper, File $fileHelper)
    {
        $sourceId = $payload['sourceId'];
        $sourceCss = get_post_meta($sourceId, 'vcvSourceCss', true);

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

        if (vcvenv('VCV_TF_CSS_CHECKSUM')) {
            $sourceCssContent = $globalElementsAttributesCssContent . $sourceCss;
            $sourceChecksum = wp_hash($sourceCssContent);
            $oldSourceChecksum = get_post_meta($sourceId, '_' . VCV_PREFIX . 'sourceChecksum', true);
            $sourceCssName = $sourceChecksum . '.source.css';

            $bundleUrl = $assetsHelper->updateBundleFile(
                $sourceCssContent,
                $sourceCssName
            );

            if ($sourceChecksum !== $oldSourceChecksum) {
                $sourcePath = $assetsHelper->getFilePath($sourceCssName);
                if ($fileHelper->isFile($sourcePath)) {
                    $this->call('deleteSourceAssetsFile', [$sourceId]);
                    update_post_meta($sourceId, '_' . VCV_PREFIX . 'sourceChecksum', $sourceChecksum);
                    update_post_meta($sourceId, 'vcvSourceCssFileUrl', $bundleUrl);
                }
            }
        } else {
            $bundleUrl = $assetsHelper->updateBundleFile(
                $globalElementsAttributesCssContent . $sourceCss,
                $sourceId . '.source.css'
            );
        }

        if (!vcvenv('VCV_TF_CSS_CHECKSUM')) {
            update_post_meta($sourceId, 'vcvSourceCssFileUrl', $bundleUrl);
            update_post_meta($sourceId, 'vcvSourceCssFileHash', md5($sourceCss));
        }

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
            if (!get_post_meta($sourcePost->ID, VCV_PREFIX . 'globalElementsCssDataMigration', true)
                && get_post_meta(
                    $sourcePost->ID,
                    VCV_PREFIX . 'pageContent',
                    true
                )) {
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

        $sourceChecksum = get_post_meta($sourceId, '_' . VCV_PREFIX . 'sourceChecksum', true);
        $extension = $sourceChecksum . '.source.css';
        $assetsHelper->deleteAssetsBundles($extension);

        /** @see \VisualComposer\Modules\Assets\FileController::generateGlobalElementsCssFile */
        $this->call('generateGlobalElementsCssFile', ['response' => []]);

        return true;
    }

    /**
     * @deprecated 2.10
     *
     * @param \VisualComposer\Helpers\Options $optionsHelper
     * @param \VisualComposer\Helpers\Assets $assetsHelper
     * @param \VisualComposer\Helpers\File $fileHelper
     * @param $globalElementsCss
     *
     * @return bool|string
     */
    protected function parseGlobalElementsCssFile(
        Options $optionsHelper,
        Assets $assetsHelper,
        File $fileHelper,
        $globalElementsCss
    ) {
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
        $optionsHelper->set('globalElementsCssHash', md5($globalElementsCss));

        return $bundleUrl;
    }
}
