<?php

namespace VisualComposer\Modules\Editors\AssetsManager;

use VisualComposer\Application;
use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Assets;
use VisualComposer\Helpers\File;
use VisualComposer\Helpers\Filters as FilterDispatcher;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Request;

/**
 * Class Controller.
 */
class Controller extends Container implements Module
{
    /**
     * @var \VisualComposer\Helpers\Filters
     */
    protected $filterHelper;

    /**
     * @var \VisualComposer\Helpers\Request
     */
    protected $requestHelper;

    /**
     * @var \VisualComposer\Helpers\Options
     */
    protected $optionsHelper;

    /**
     * @var \VisualComposer\Helpers\File
     */
    protected $fileHelper;

    /**
     * @var \VisualComposer\Helpers\Assets
     */
    protected $assetsHelper;

    /**
     * Controller constructor.
     *
     * @param \VisualComposer\Helpers\Filters $filterHelper
     * @param \VisualComposer\Helpers\Request $request
     * @param \VisualComposer\Helpers\Options $optionsHelper
     * @param \VisualComposer\Helpers\File $fileHelper
     * @param \VisualComposer\Helpers\Assets $assetsHelper
     */
    public function __construct(
        FilterDispatcher $filterHelper,
        Request $request,
        Options $optionsHelper,
        File $fileHelper,
        Assets $assetsHelper
    ) {
        $this->filterHelper = $filterHelper;
        $this->requestHelper = $request;
        $this->optionsHelper = $optionsHelper;
        $this->fileHelper = $fileHelper;
        $this->assetsHelper = $assetsHelper;

        $this->filterHelper->listen(
            'vcv:dataAjax:setData',
            function ($response, $payload) {
                /** @see \VisualComposer\Modules\Editors\AssetsManager\Controller::setPostDataHook */
                $data = $this->call('setPostDataHook', [$payload['sourceId']]);
                if ($data) {
                    $response['data'] = $data;
                } else {
                    $response['status'] = false;
                }

                return $response;
            }
        );
        // Save compiled less into one css bundle.
        $this->filterHelper->listen(
            'vcv:ajax:saveCssBundle:adminNonce',
            function ($response, $payload) {
                /** @see \VisualComposer\Modules\Editors\AssetsManager\Controller::saveCssBundleHook */
                $data = $this->call('saveCssBundleHook', [$payload['sourceId']]);
                if ($data) {
                    $response['data'] = $data;
                } else {
                    $response['status'] = false;
                }

                return $response;
            }
        );
        $this->filterHelper->listen(
            'vcv:dataAjax:getData',
            function ($response, $payload, Request $requestHelper) {
                $response['globalElements'] = $this->optionsHelper->get('global-elements', '');
                $customCss = $this->optionsHelper->get('custom-css', []);
                $postCustomCss = '';
                $id = $requestHelper->input('vcv-source-id');
                if (isset($customCss[ $id ])) {
                    $postCustomCss = $customCss[ $id ];
                }
                $response['cssSettings'] = [
                    'custom' => $postCustomCss,
                    'global' => $this->optionsHelper->get('global-css', ''),
                ];

                return $response;
            }
        );

        add_action(
            'before_delete_post',
            function ($postId) {
                /** @see \VisualComposer\Modules\Editors\AssetsManager\Controller::deletePostAssetsHook */
                return $this->call('deletePostAssetsHook', [$postId]);
            }
        );
    }

    /**
     * @param $postId
     *
     * @return array
     */
    private function setPostDataHook($postId)
    {
        $this->updateGlobalAssets(
            'scripts',
            $this->requestHelper->input('vcv-scripts', [])
        );
        $this->updateGlobalAssets(
            'shared-library-styles',
            $this->requestHelper->input('vcv-shared-library-styles', [])
        );
        $this->updatePostAssets(
            $postId,
            'styles',
            $this->requestHelper->input('vcv-styles', [])
        );
        $this->updatePostAssets(
            $postId,
            'design-options',
            $this->requestHelper->input('vcv-design-options', '')
        );
        $this->updatePostAssets(
            $postId,
            'custom-css',
            $this->requestHelper->input('vcv-custom-css', '')
        );
        $this->updateGlobalAssets(
            'global-elements',
            rawurldecode($this->requestHelper->input('vcv-global-elements', ''))
        );
        $this->updateGlobalAssets(
            'global-css',
            rawurldecode($this->requestHelper->input('vcv-global-css', ''))
        );
        $this->updateGlobalAssets(
            'global-styles',
            $this->requestHelper->input('vcv-global-styles', '')
        );
        $scriptsBundles = $this->generateScriptsBundle();
        $this->generateSharedLibraryCssBundle();
        // $styleBundles = $this->getStyleBundles();
        $globalStylesFile = $this->generateStylesGlobalFile();
        $this->generatePostStyles($postId);

        return [
            'scriptBundles' => $scriptsBundles,
            // 'styleBundles' => $styleBundles,
            'globalStylesFile' => $globalStylesFile,
        ];
    }

    /**
     * Called every time post is permanently deleted.
     * Remove list of associated assets.
     *
     * @param int $postId Post ID
     *
     * @return $this
     */
    private function deletePostAssetsHook($postId)
    {
        foreach ([
            'scripts',
            'styles',
        ] as $assetType) {
            $assets = $this->optionsHelper->get($assetType, []);

            if (!is_array($assets) || !isset($assets[ $postId ])) {
                continue;
            }

            unset($assets[ $postId ]);

            $this->optionsHelper->set($assetType, $assets);
        }

        return true;
    }

    /**
     * Save compiled less into one css bundle.
     */
    private function saveCssBundleHook()
    {
        $contents = $this->requestHelper->input('vcv-contents');

        $bundleUrl = $this->generateStylesBundle($contents);

        if ($bundleUrl) {
            return ['filename' => $bundleUrl];
        }

        return false;
    }

    /**
     * Generate (save to fs and update db) scripts bundle.
     * Old files are deleted.
     *
     * @return bool|string URL to generated bundle.
     */
    private function generateScriptsBundleByFile()
    {
        // TODO: Check for usage.

        $assets = $this->optionsHelper->get('scripts', []);

        $files = [];
        if (is_array($assets)) {
            foreach ($assets as $postId => $elements) {
                if (is_array($elements)) {
                    foreach ($elements as $element => $elementAssets) {
                        $files = array_merge($files, $elementAssets);
                    }
                }
            }
        }
        $files = array_unique($files);

        if (!empty($files)) {
            $concatenatedFilename = md5(implode(',', $files)) . '.js';
            $bundleUrl = $this->assetsHelper->getFileUrl($concatenatedFilename);
            $bundle = $this->assetsHelper->getFilePath($concatenatedFilename);
            /** @var $app Application */
            $app = vcapp();
            if (!is_file($bundle)) {
                $contents = '';
                foreach ($files as $file) {
                    $filepath = $app->path('public/sources/' . $file);
                    $contents .= $this->fileHelper->getContents($filepath) . "\n";
                }

                $this->deleteAssetsBundles('js');
                if (!$this->fileHelper->setContents($bundle, $contents)) {
                    return false;
                }
            }
        } else {
            $this->deleteAssetsBundles('js');
            $bundleUrl = '';
        }

        $this->optionsHelper->set('scriptsBundle', $bundleUrl);

        return $bundleUrl;
    }

    /**
     * Generate (save to fs and update db) scripts bundle.
     * Old files are deleted.
     *
     * @return bool|string URL to generated bundle.
     */
    private function generateScriptsBundle()
    {
        $files = $this->optionsHelper->get('scripts', []);
        // remove file
        $bundleUrl = '';
        $this->deleteAssetsBundles('global.js');
        if (!empty($files) && is_array($files)) {
            /** @var $app Application */
            $app = vcapp();
            $frontMainFile = $app->path('public/dist/front.bundle.js');
            $contents = $this->fileHelper->getContents($frontMainFile);
            foreach ($files as $file) {
                $filepath = $app->path('public/sources/' . $file);
                $contents .= '(function(){' . $this->fileHelper->getContents($filepath) . "})();\n";
            }

            $bundleUrl = $this->createBundleFile($contents, 'global.js');
            $this->optionsHelper->set('scriptsGlobalFile', $bundleUrl);
        }

        $this->optionsHelper->set('scriptsGlobalFile', $bundleUrl);

        return $bundleUrl;
    }

    /**
     * Generate (save to fs and update db) scripts bundle.
     * Old files are deleted.
     *
     * @return bool|string URL to generated bundle.
     */
    private function generateSharedLibraryCssBundle()
    {
        $files = $this->optionsHelper->get('shared-library-styles', []);
        $bundleUrl = '';
        $this->deleteAssetsBundles('sharedglobal.css');
        if (!empty($files) && is_array($files)) {
            /** @var $app Application */
            $app = vcapp();
            $contents = '';
            foreach ($files as $file) {
                $filepath = $app->path('public/sources/' . $file);
                $contents .= $this->fileHelper->getContents($filepath) . "\n";
            }
            $bundleUrl = $this->createBundleFile($contents, 'sharedglobal.css');
            $this->optionsHelper->set('sharedLibraryGlobalFile', $bundleUrl);
        }

        $this->optionsHelper->set('sharedLibraryGlobalFile', $bundleUrl);

        return $bundleUrl;
    }

    /**
     * Generate (save to fs and update db) scripts bundle.
     * Old files are deleted.
     *
     * @param string $contents CSS contents to save.
     *
     * @return bool|string URL to generated bundle.
     */
    private function generateStylesBundle($contents)
    {
        if ($contents) {
            $concatenatedFilename = md5($contents) . '.css';
            $bundleUrl = $this->assetsHelper->getFileUrl($concatenatedFilename);
            $bundle = $this->assetsHelper->getFilePath($concatenatedFilename);
            if (!is_file($bundle)) {
                $this->deleteAssetsBundles('css');
                if (!$this->fileHelper->setContents($bundle, $contents)) {
                    return false;
                }
            }
        } else {
            $this->deleteAssetsBundles('css');
            $bundleUrl = '';
        }

        $this->optionsHelper->set('stylesBundle', $bundleUrl);

        return $bundleUrl;
    }

    /**
     * @return array
     */
    private function getStyleBundles()
    {
        // TODO: Check for usage.

        $assets = $this->optionsHelper->get('styles', []);

        $list = [];
        if (is_array($assets)) {
            foreach ($assets as $postId => $elements) {
                $list = array_merge($list, (array)$elements);
            }
        }

        $bundles = [];
        /** @var Application $app */
        $app = vcapp();
        foreach ($list as $element => $files) {
            $contents = '';
            if (is_array($files)) {
                foreach ($files as $file) {
                    $filepath = $app->path('public/sources/elements/' . $file);
                    $contents .= $this->fileHelper->getContents($filepath) . "\n";
                }
            }

            $bundles[] = [
                'filename' => $element . '.less',
                'contents' => $contents,
            ];
        }

        return $bundles;
    }

    /**
     * Generate (save to fs and update db) styles bundle.
     *
     * @return bool|string URL to generated bundle.
     */
    private function generateStylesGlobalFile()
    {
        $styles = $this->optionsHelper->get('global-styles', '');
        $globalCss = $this->optionsHelper->get('global-css', '');
        $this->deleteAssetsBundles('global.css');
        $bundleUrl = $this->createBundleFile($styles . $globalCss, 'global.css');
        $this->optionsHelper->set('stylesGlobalFile', $bundleUrl);

        // remove file
        return $bundleUrl;
    }

    /**
     *
     * Generate (save to fs and update db) post styles bundle.
     *
     * @param $postId
     *
     * @return bool|string URL to generated bundle.
     */
    private function generatePostStyles($postId)
    {
        $postsStyles = $this->optionsHelper->get('design-options');
        $style = '';
        if (isset($postsStyles[ $postId ])) {
            $style = $postsStyles[ $postId ];
        }
        $postsCustomCss = $this->optionsHelper->get('custom-css');
        if (isset($postsCustomCss[ $postId ])) {
            $style .= $postsCustomCss[ $postId ];
        }
        $bundleUrl = $this->createBundleFile($style, 'css');
        $this->optionsHelper->set('postStyles-' . $postId, $bundleUrl);

        // remove file
        return $bundleUrl;
    }

    /**
     * Create file with content in filesystem
     *
     * @param $content
     * @param $extension
     *
     * @return bool|string
     */
    private function createBundleFile($content, $extension)
    {
        $bundleUrl = false;
        if ($content) {
            $concatenatedFilename = md5($content) . '.' . $extension;
            $bundle = $this->assetsHelper->getFilePath($concatenatedFilename);
            $bundleUrl = $this->assetsHelper->getFileUrl($concatenatedFilename);
            if (!is_file($bundle)) {
                if (!$this->fileHelper->setContents($bundle, $content)) {
                    return false;
                }
            }
        }

        return $bundleUrl;
    }

    /**
     * @param int $postId
     * @param string $assetType scripts|styles.
     * @param string[] $postAssets
     *
     * @return array|mixed
     */
    private function updatePostAssets($postId, $assetType, $postAssets)
    {
        $assets = $this->optionsHelper->get($assetType, []);
        if (!is_array($assets)) {
            $assets = [];
        }

        if ($postAssets) {
            $assets[ $postId ] = $postAssets;
        } else {
            unset($assets[ $postId ]); // TODO: check for isset??
        }

        $this->optionsHelper->set($assetType, $assets);

        return $assets;
    }

    /**
     * @param string $assetType scripts|styles.
     * @param string[] $postAssets
     *
     * @return array|mixed
     */
    private function updateGlobalAssets($assetType, $postAssets)
    {
        $assets = $this->optionsHelper->get($assetType, '');
        $this->optionsHelper->set($assetType, $postAssets);

        return $assets;
    }

    /**
     * Remove all files by extension in asset-bundles directory.
     *
     * @param string $extension
     *
     * @return array
     */
    private function deleteAssetsBundles($extension = '')
    {
        $destinationDir = $this->assetsHelper->getFilePath();
        if ($extension) {
            $extension = '.' . $extension;
        }
        /** @var Application $app */
        $app = vcapp();
        $files = $app->rglob($destinationDir . '/*' . $extension);
        if (is_array($files)) {
            foreach ($files as $file) {
                unlink($file);
            }
        }

        return $files;
    }
}
