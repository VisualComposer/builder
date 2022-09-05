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

class FileController extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    public function __construct(Frontend $frontendHelper, Assets $assetsHelper)
    {
        if (!$frontendHelper->isPreview()) {
            $this->addFilter(
                'vcv:dataAjax:setData',
                'setSourceCssFile'
            );
        }

        /** @see \VisualComposer\Modules\Assets\FileController::setSourceCssFile */
        $this->addEvent(
            'vcv:assets:file:generate',
            'setSourceCssFile'
        );

        /** @see \VisualComposer\Modules\Assets\FileController::deleteSourceCssFile */
        $this->wpAddAction('before_delete_post', 'deleteSourceCssFile');

        /**
         * Migration callback to move globalElements Attribute.css into source.css file
         * @see
         */
        $this->wpAddAction('wp_enqueue_scripts', 'checkGenerateSourceCss');
    }

    protected function deleteSourceCssFile($sourceId, Assets $assetsHelper)
    {
        $assetsHelper->deleteSourceAssetsFile($sourceId);
    }

    /**
     * Generate post styles bundle.
     *
     * @param bool|string $response
     * @param array $payload
     * @param \VisualComposer\Helpers\Assets $assetsHelper
     *
     * @return bool|string
     * @throws \ReflectionException
     * @throws \VisualComposer\Framework\Illuminate\Container\BindingResolutionException
     */
    protected function setSourceCssFile($response, $payload, Assets $assetsHelper)
    {
        $response = $assetsHelper->generateSourceCssFile($response, $payload);

        return $response;
    }

    /**
     * @param \VisualComposer\Helpers\PostType $postTypeHelper
     *
     * @throws \ReflectionException
     * @throws \VisualComposer\Framework\Illuminate\Container\BindingResolutionException
     */
    protected function checkGenerateSourceCss(PostType $postTypeHelper, Options $optionsHelper)
    {
        $sourcePost = $postTypeHelper->get();
        if ($sourcePost && $sourcePost->ID) {
            $postSourceCssResetInitiated = get_post_meta(
                $sourcePost->ID,
                '_' . VCV_PREFIX . 'postSourceCssResetInitiated',
                true
            );
            $settingsResetInitiated = $optionsHelper->get('settingsResetInitiated');
            $isResetInitiated = $settingsResetInitiated
                && $settingsResetInitiated >= $postSourceCssResetInitiated
                //@codingStandardsIgnoreLine
                && $settingsResetInitiated >= strtotime($sourcePost->post_date);

            if ($isResetInitiated) {
                $assetsHelper = vchelper('Assets');
                $assetsHelper->generateSourceCssFile([], ['sourceId' => $sourcePost->ID]);
                update_post_meta($sourcePost->ID, '_' . VCV_PREFIX . 'postSourceCssResetInitiated', time());
            }
        }
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
