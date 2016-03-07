<?php

namespace VisualComposer\Modules\Editors\AssetsManager;

use VisualComposer\Helpers\WordPress\Options;
use VisualComposer\Helpers\WordPress\File;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Http\Request;
use VisualComposer\Modules\System\Container;

class AssetsManagerController extends Container
{
    /**
     * @var \Laravel\Lumen\Application
     */
    protected $app;

    /**
     * @var \Illuminate\Contracts\Events\Dispatcher
     */
    protected $event;

    /**
     * @var \Illuminate\Http\Request
     */
    protected $request;

    /**
     * AssetsController constructor.
     *
     * @param \Illuminate\Contracts\Events\Dispatcher $event
     * @param \Illuminate\Http\Request $request
     */
    public function __construct(Dispatcher $event, Request $request)
    {
        $this->app = app();
        $this->event = $event;
        $this->request = $request;

        $this->event->listen('vc:v:postAjax:setPostData', function () {
            $args = func_get_args();
            $this->call('setPostDataHook', $args);
        });

        add_action('before_delete_post', function () {
            $args = func_get_args();
            $this->call('deletePostAssetsHook', $args);
        });

        // Save compiled less into one css bundle
        add_action('vc:v:ajax:loader:saveCssBundle:admin-nonce', function () {
            $args = func_get_args();
            $this->call('saveCssBundleHook', $args);
        });
    }

    /**
     * @param $postId
     */
    private function setPostDataHook($postId)
    {
        $this->updatePostAssets($postId, 'scripts', $this->request->has('scripts') ? $this->request->input('scripts') : []);
        $this->updatePostAssets($postId, 'styles', $this->request->has('styles') ? $this->request->input('styles') : []);
        $this->generateScriptsBundle();
        $styleBundles = $this->getStyleBundles();
        wp_send_json_success(['styleBundles' => $styleBundles]);
    }

    /**
     * Called every time post is permanently deleted
     * Remove list of associated assets
     *
     * @param int $postId Post ID
     */
    private function deletePostAssetsHook($postId)
    {
        foreach ([
            'scripts',
            'styles',
        ] as $assetType) {
            $assets = Options::get($assetType, []);

            if ( ! is_array($assets) || ! isset($assets[$postId])) {
                continue;
            }

            unset($assets[$postId]);

            Options::set($assetType, $assets);
        }
    }

    /**
     * Save compiled less into one css bundle
     */
    private function saveCssBundleHook()
    {
        $contents = $this->request->input('contents');

        $bundleUrl = $this->generateStylesBundle($contents);

        if ($bundleUrl === false) {
            wp_send_json_error();
        }
        wp_send_json_success(['filename' => $bundleUrl]);
    }

    /**
     * Generate (save to fs and update db) scripts bundle
     * Old files are deleted
     *
     * @return bool|string URL to generated bundle
     */
    private function generateScriptsBundle()
    {
        $assets = Options::get('scripts', []);

        $files = [];
        if (is_array($assets)) {
            foreach ($assets as $post_id => $elements) {
                if (is_array($elements)) {
                    foreach ($elements as $element => $elementAssets) {
                        $files = array_merge($files, $elementAssets);
                    }
                }
            }
        }
        $files = array_unique($files);

        if ( ! empty($files)) {
            $uploadDir = wp_upload_dir();
            $concatenatedFilename = md5(implode(',', $files)).'.js';
            $bundleUrl = $uploadDir['baseurl'].'/'.VC_V_PLUGIN_DIRNAME.'/asset-bundles'.'/'.$concatenatedFilename;

            $destinationDir = $uploadDir['basedir'].'/'.VC_V_PLUGIN_DIRNAME.'/asset-bundles';
            $bundle = $destinationDir.'/'.$concatenatedFilename;

            if ( ! is_file($bundle)) {
                $contents = '';
                foreach ($files as $file) {
                    $filepath = VC_V_PLUGIN_DIR_PATH.'public/sources/elements/'.$file;
                    $contents .= File::getContents($filepath)."\n";
                }

                $this->deleteAssetsBundles('js');
                if ( ! File::setContents($bundle, $contents)) {
                    return false;
                }
            }
        } else {
            $this->deleteAssetsBundles('js');
            $bundleUrl = '';
        }

        Options::set('scriptsBundle', $bundleUrl);

        return $bundleUrl;
    }

    /**
     * Generate (save to fs and update db) scripts bundle
     * Old files are deleted
     *
     * @param string $contents CSS contents to save
     *
     * @return bool|string URL to generated bundle
     */
    private function generateStylesBundle($contents)
    {
        if ($contents) {
            $uploadDir = wp_upload_dir();
            $concatenatedFilename = md5($contents).'.css';
            $bundleUrl = $uploadDir['baseurl'].'/'.VC_V_PLUGIN_DIRNAME.'/assets-bundles'.'/'.$concatenatedFilename;

            $destinationDir = $uploadDir['basedir'].'/'.VC_V_PLUGIN_DIRNAME.'/assets-bundles';
            $bundle = $destinationDir.'/'.$concatenatedFilename;

            if ( ! is_file($bundle)) {
                $this->deleteAssetsBundles('css');
                if ( ! File::setContents($bundle, $contents)) {
                    return false;
                }
            }
        } else {
            $this->deleteAssetsBundles('css');
            $bundleUrl = '';
        }

        Options::set('stylesBundle', $bundleUrl);

        return $bundleUrl;
    }

    /**
     * @return array
     */
    private function getStyleBundles()
    {
        $assets = Options::get('styles', []);

        $list = [];
        if (is_array($assets)) {
            foreach ($assets as $postId => $elements) {
                $list = array_merge($list, (array)$elements);
            }
        }

        $bundles = [];
        foreach ($list as $element => $files) {
            $contents = '';
            if (is_array($files)) {
                foreach ($files as $file) {
                    $filepath = VC_V_PLUGIN_DIR_PATH.'public/sources/elements/'.$file;
                    $contents .= File::getContents($filepath)."\n";
                }
            }

            $bundles[] = [
                'filename' => $element.'.less',
                'contents' => $contents,
            ];
        }

        return $bundles;
    }

    /**
     * @param int $postId
     * @param string $assetType scripts|styles
     * @param string[] $postAssets
     */
    private function updatePostAssets($postId, $assetType, $postAssets)
    {
        $assets = Options::get($assetType, []);
        if ( ! is_array($assets)) {
            $assets = [];
        }

        if ($postAssets) {
            $assets[$postId] = $postAssets;
        } else {
            unset($assets[$postId]); // @todo check for isset??
        }

        Options::set($assetType, $assets);
    }

    /**
     * Remove all files by extension in asset-bundles directory
     *
     * @param string $extension
     */
    private function deleteAssetsBundles($extension = '')
    {
        $uploadDir = wp_upload_dir();
        $destinationDir = $uploadDir['basedir'].'/'.VC_V_PLUGIN_DIRNAME.'/assets-bundles';

        if ($extension) {
            $extension = '.'.$extension;
        }

        $files = glob($destinationDir.'/*'.$extension);
        if (is_array($files)) {
            foreach ($files as $file) {
                unlink($file);
            }
        }
    }

}
