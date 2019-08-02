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
            /** @see \VisualComposer\Modules\Assets\FileController::generateSourceCssFile */
            $this->addFilter(
                'vcv:dataAjax:setData',
                'generateSourceCssFile'
            );
        }

        /** @see \VisualComposer\Modules\Assets\FileController::generateSourceCssFile */
        $this->addEvent(
            'vcv:assets:file:generate',
            'generateSourceCssFile'
        );

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
     *
     * Generate (save to fs and update db) post styles bundle.
     *
     * @param $response
     * @param $payload
     * @param \VisualComposer\Helpers\Assets $assetsHelper
     *
     * @param \VisualComposer\Helpers\File $fileHelper
     *
     * @param \VisualComposer\Helpers\Options $optionsHelper
     *
     * @return bool|string URL to generated bundle.
     * @throws \ReflectionException
     */
    protected function generateSourceCssFile(
        $response,
        $payload,
        Assets $assetsHelper,
        File $fileHelper,
        Options $optionsHelper
    ) {
        $globalElementsBaseCss = [];
        $globalElementsMixinsCss = [];
        $sourceId = $payload['sourceId'];
        $sourceCss = get_post_meta($sourceId, 'vcvSourceCss', true);

        $globalElementsCssData = get_post_meta($sourceId, VCV_PREFIX . 'globalElementsCssData', true);
        $globalElementsAttributesCss = [];
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
        $globalCss = $optionsHelper->get('globalElementsCss', '');

        $globalElementsAttributesCssContent = join('', array_values($globalElementsAttributesCss));
        $globalElementsBaseCssContent = join('', array_values($globalElementsBaseCss));
        $globalElementsMixinsCssContent = join('', array_values($globalElementsMixinsCss));
        $sourceCssContent = $globalElementsBaseCssContent . $globalElementsMixinsCssContent . $globalCss
            . $globalElementsAttributesCssContent . $sourceCss;

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
                update_post_meta($sourceId, '_' . VCV_PREFIX . 'globalCssMigrated', 1);
            }
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

        return true;
    }

    /**
     * @param \VisualComposer\Helpers\Options $optionsHelper
     * @param \VisualComposer\Helpers\Assets $assetsHelper
     * @param \VisualComposer\Helpers\File $fileHelper
     * @param $globalElementsCss
     *
     * @return bool|string
     * @deprecated 2.10
     *
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

        $bundleUrl = $assetsHelper->updateBundleFile($globalElementsCss, 'global-elements.css');
        if ($bundleUrl) {
            if (!empty($previousCssFile) && empty($previousCssHash)) {
                $assetsPath = $assetsHelper->getFilePath($previousCssFile);
                if (!empty($assetsPath)) {
                    $fileHelper->getFileSystem()->delete($assetsPath);
                }
            }
        }

        $optionsHelper->set('globalElementsCssHash', md5($globalElementsCss));

        return $bundleUrl;
    }
}
