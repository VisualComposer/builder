<?php

namespace VisualComposer\Modules\Hub\Assets;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Assets;
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
                'vcv:hub:download:bundle vcv:hub:download:bundle:assets vcv:hub:download:bundle:asset/*',
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
        Logger $loggerHelper,
        Assets $assetsHelper
    ) {
        $bundleJson = $payload['archive'];
        if (vcIsBadResponse($response) || is_wp_error($bundleJson)) {
            $this->logErrors($response, $loggerHelper, $bundleJson);

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
            $differ->optionMergeByReplace(true);
            // Set old
            if (vcvenv('VCV_FT_ASSETS_INSIDE_PLUGIN')) {
                $differ->set($optionsHelper->get('assetsLibrary', []));
            } else {
                $differ->set($assetsSharedHelper->getSharedAssets());
            }
            // Merge new
            $differ->set($toSaveAssetsLibrary);
            $optionsHelper->set('assetsLibrary', $differ->get());

            if (!isset($response['sharedAssets'])) {
                $response['sharedAssets'] = $toSaveAssetsLibrary;
            } else {
                $response['sharedAssets'] = array_merge($response['sharedAssets'], $toSaveAssetsLibrary);
            }
            $response['sharedAssetsUrl'] = $assetsHelper->getAssetUrl();
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

        if (vcvenv('VCV_TF_ASSETS_IN_UPLOADS')) {
            $assetUrl = 'sharedLibraries/' . $asset['name'];
        } else {
            $assetUrl = $hubSharedLibrariesHelper->getLibraryUrl($asset['name']);
        }
        if (!vcIsBadResponse($result)) {
            if (isset($asset['jsBundle'])) {
                $asset['jsBundle'] = str_replace('[publicPath]', $assetUrl, $asset['jsBundle']);
            }
            if (isset($asset['cssBundle'])) {
                $asset['cssBundle'] = str_replace('[publicPath]', $assetUrl, $asset['cssBundle']);
            }
            if (isset($asset['cssSubsetBundles'])) {
                $cssSubsetBundles = [];
                foreach ($asset['cssSubsetBundles'] as $singleKey => $single) {
                    $cssSubsetBundles[ $singleKey ] = str_replace('[publicPath]', $assetUrl, $single);
                }
                $asset['cssSubsetBundles'] = $cssSubsetBundles;
            }
        }

        return $asset;
    }

    /**
     * @param $response
     * @param \VisualComposer\Helpers\Logger $loggerHelper
     * @param $bundleJson
     */
    protected function logErrors($response, Logger $loggerHelper, $bundleJson)
    {
        $messages = [];
        $messages[] = __('Failed to update shared libraries', 'vcwb') . ' #10021';
        if (is_wp_error($response)) {
            /** @var \WP_Error $response */
            $messages[] = implode('. ', $response->get_error_messages()) . ' #10022';
        } elseif (is_array($response) && isset($response['body'])) {
            // @codingStandardsIgnoreLine
            $resultDetails = @json_decode($response['body'], 1);
            if (is_array($resultDetails) && isset($resultDetails['message'])) {
                $messages[] = $resultDetails['message'] . ' #10023';
            }
        }
        if (is_wp_error($bundleJson)) {
            /** @var \WP_Error $bundleJson */
            $messages[] = implode('. ', $bundleJson->get_error_messages()) . ' #10024';
        } elseif (is_array($bundleJson) && isset($bundleJson['body'])) {
            // @codingStandardsIgnoreLine
            $resultDetails = @json_decode($bundleJson['body'], 1);
            if (is_array($resultDetails) && isset($resultDetails['message'])) {
                $messages[] = $resultDetails['message'] . ' #10025';
            }
        }

        $loggerHelper->log(
            implode('. ', $messages),
            [
                'response' => is_wp_error($response) ? 'wp error' : $response,
                'bundleJson' => is_wp_error($bundleJson) ? 'wp_error' : $bundleJson,
            ]
        );
    }
}
