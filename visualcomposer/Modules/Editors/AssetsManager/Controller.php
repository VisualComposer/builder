<?php

namespace VisualComposer\Modules\Editors\AssetsManager;

use VisualComposer\Application;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\File;
use VisualComposer\Helpers\Filters as FilterDispatcher;
use VisualComposer\Helpers\Request;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Class Controller.
 */
class Controller extends Container implements Module
{
    use WpFiltersActions;

    /**
     * @var \VisualComposer\Helpers\Filters
     */
    protected $filter;

    /**
     * @var \VisualComposer\Helpers\Request
     */
    protected $request;

    /**
     * @var \VisualComposer\Helpers\Options
     */
    protected $options;

    /**
     * @var \VisualComposer\Helpers\File
     */
    protected $file;

    /**
     * Controller constructor.
     *
     * @param \VisualComposer\Helpers\Filters $filterHelper
     * @param \VisualComposer\Helpers\Request $request
     * @param \VisualComposer\Helpers\Options $optionsHelper
     * @param \VisualComposer\Helpers\File $fileHelper
     */
    public function __construct(
        FilterDispatcher $filterHelper,
        Request $request,
        Options $optionsHelper,
        File $fileHelper
    ) {
        $this->filter = $filterHelper;
        $this->request = $request;
        $this->options = $optionsHelper;
        $this->file = $fileHelper;

        return; // Feature Toggle
        $this->filter->listen(
            'vcv:postAjax:setPostData',
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
        $this->filter->listen(
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

        /** @see \VisualComposer\Modules\Editors\AssetsManager\Controller::deletePostAssetsHook */
        $this->wpAddFilter(
            'before_delete_post',
            'deletePostAssetsHook'
        );
    }

    /**
     * @param $postId
     *
     * @return array
     */
    private function setPostDataHook($postId)
    {
        $this->updateAssets(
            'scripts',
            $this->request->input('vcv-scripts', '')
        );
        $this->updateAssets(
            'styles',
            $this->request->input('vcv-styles', '')
        );
        $this->setElementsList(
            $this->request->input('vcv-elements-list', '')
        );
        $scriptsBundle = $this->generateScriptsBundle();
        $stylesBundle = $this->generateStylesBundle();

        return [
            'scriptBundle' => $scriptsBundle,
            'styleBundle' => $stylesBundle,
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
            $assets = $this->options->get($assetType, []);

            if (!is_array($assets) || !isset($assets[ $postId ])) {
                continue;
            }

            unset($assets[ $postId ]);

            $this->options->set($assetType, $assets);
        }

        return true;
    }

    /**
     * Save compiled less into one css bundle.
     */
    private function saveCssBundleHook()
    {
        $contents = $this->request->input('vcv-contents');

        $bundleUrl = $this->generateStylesBundle($contents);

        if ($bundleUrl) {
            return ['filename' => $bundleUrl];
        }

        return false;
    }

    /**
     * Generate (save to fs and update db) scripts bundle.
     *
     * @return bool|string URL to generated bundle.
     */
    private function generateScriptsBundle()
    {
        $scripts = $this->options->get('scripts', '');
        $bundleUrl = $this->createBundleFile($scripts, 'js');
        $this->options->set('scriptsBundle', $bundleUrl);

        return $bundleUrl;
    }

    /**
     * Generate (save to fs and update db) styles bundle.
     *
     * @return bool|string URL to generated bundle.
     */
    private function generateStylesBundle()
    {
        $styles = $this->options->get('styles', '');
        $bundleUrl = $this->createBundleFile($styles, 'css');
        $this->options->set('stylesBundle', $bundleUrl);

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
            $uploadDir = wp_upload_dir();
            $concatenatedFilename = md5($content) . '.' . $extension;
            $bundleUrl = $uploadDir['baseurl'] . '/' . VCV_PLUGIN_DIRNAME . '/assets-bundles' . '/'
                . $concatenatedFilename;

            $destinationDir = $uploadDir['basedir'] . '/' . VCV_PLUGIN_DIRNAME . '/assets-bundles';
            $bundle = $destinationDir . '/' . $concatenatedFilename;

            if (!is_file($bundle)) {
                if (!$this->file->setContents($bundle, $content)) {
                    return false;
                }
            }
        }

        return $bundleUrl;
    }

    /**
     * @param string $assetType scripts|styles.
     * @param string[] $data
     *
     * @return array|mixed
     */
    private function updateAssets($assetType, $data)
    {
        $assets = $this->options->get($assetType, '');
        $this->options->set($assetType, $assets);

        return $assets;
    }

    /**
     * Update elements list
     *
     * @param string[] $data
     *
     * @return string
     */
    private function setElementsList($data)
    {
        $this->options->set('vcv-elements-list', $data);

        return $data;
    }

    /**
     * Get elements list
     *
     * @return string
     */
    private function getElementsList()
    {
        return $this->options->get('vcv-elements-list', '');
    }
}
