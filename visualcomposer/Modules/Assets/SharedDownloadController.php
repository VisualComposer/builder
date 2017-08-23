<?php

namespace VisualComposer\Modules\Assets;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\AssetsShared;
use VisualComposer\Helpers\File;
use VisualComposer\Helpers\Hub\SharedLibraries;
use VisualComposer\Helpers\Logger;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;

class SharedDownloadController extends Container implements Module
{
    use EventsFilters;

    public function __construct(Options $optionsHelper)
    {
        if (vcvenv('VCV_ENV_EXTENSION_DOWNLOAD')) {
            /** @see \VisualComposer\Modules\Assets\SharedDownloadController::updateSharedLibraries */
            $this->addFilter(
                'vcv:hub:download:bundle vcv:hub:download:bundle:assets',
                'updateSharedLibraries',
                70
            );
        }
    }

    protected function updateSharedLibraries(
        $response,
        $payload,
        Options $optionsHelper,
        File $fileHelper,
        SharedLibraries $sharedLibrariesHelper,
        AssetsShared $assetsSharedHelper,
        Logger $loggerHelper
    ) {
        $bundleJson = $payload['archive'];
        if (vcIsBadResponse($response) || is_wp_error($bundleJson)) {
            $loggerHelper->log(__('Failed to update shared libraries', 'vcwb'), [
                'response' => $response,
                'bundleJson' => $bundleJson,
            ]);

            return ['status' => false];
        }
        if (isset($bundleJson['assetsLibrary'])) {
            $assetsLibrary = $bundleJson['assetsLibrary'];
            $toSaveAssetsLibrary = [];

            $fileHelper->createDirectory(
                $sharedLibrariesHelper->getLibraryPath()
            );

            foreach ($assetsLibrary as $index => $asset) {
                $fileHelper->createDirectory(
                    $sharedLibrariesHelper->getLibraryPath($asset['name'])
                );

                $assetData = $this->processLibrary($asset);
                if ($assetData) {
                    $toSaveAssetsLibrary[ $asset['name'] ] = $assetData;
                }
            }
            $differ = vchelper('Differ');
            // Set old
            $differ->set($assetsSharedHelper->getSharedAssets());
            // Merge new
            $differ->set($toSaveAssetsLibrary);
            $optionsHelper->set('assetsLibrary', $differ->get());
        }

        return $response;
    }

    protected function processLibrary($asset)
    {
        $fileHelper = vchelper('File');
        $hubSharedLibrariesHelper = vchelper('HubSharedLibraries');
        $hubBundleHelper = vchelper('HubActionsSharedLibrariesBundle');
        $assetPath = $hubSharedLibrariesHelper->getLibraryPath($asset['name']);

        $result = $fileHelper->copyDirectory(
            $hubBundleHelper->getTempBundleFolder('assetsLibrary/' . $asset['name']),
            $assetPath
        );

        $assetUrl = $hubSharedLibrariesHelper->getLibraryUrl($asset['name']);
        if (!is_wp_error($result)) {
            if (isset($asset['jsBundle'])) {
                $asset['jsBundle'] = str_replace('[publicPath]', $assetUrl, $asset['jsBundle']);
            }
            if (isset($asset['cssBundle'])) {
                $asset['cssBundle'] = str_replace('[publicPath]', $assetUrl, $asset['cssBundle']);
            }
        }

        return $asset;
    }
}
