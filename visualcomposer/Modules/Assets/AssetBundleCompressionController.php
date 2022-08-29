<?php

namespace VisualComposer\Modules\Assets;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\WpFiltersActions;

/**
 * Class AssetBundleController
 * @package VisualComposer\Modules\Assets
 */
class AssetBundleCompressionController extends Container implements Module
{
    use WpFiltersActions;

    /**
     * AssetBundleController constructor.
     */
    public function __construct()
    {
        $this->outputCompression();
    }

    /**
     * Trying to output compression bundle.
     */
    protected function outputCompression()
    {
        if (empty($_GET['vcv-script']) && empty($_GET['vcv-style'])) {
            return;
        }

        error_reporting(0);
        $mimeType = $this->getMimeType();
        header('Content-Type: ' . $mimeType);

        $gzipHelper = vchelper('Gzip');

        if ($gzipHelper->isGzip()) {
            // output our gzip content.
            header("Content-Encoding: gzip");
            echo file_get_contents($this->getBundlePath(true));
        } else {
            // browser cannot accept compressed content, so need output standard JS/CSS
            echo file_get_contents($this->getBundlePath());
        }

        exit;
    }

    /**
     * Get current requested bundle path.
     *
     * @param bool $isCompress
     *
     * @return string
     */
    protected function getBundlePath($isCompress = false)
    {
        $assetType = $this->getAssetType();

        $name = $this->getCompressionRequestName($assetType);

        $path = VCV_PLUGIN_DIR_PATH . 'public/dist/' . $name . '.bundle.' . $assetType;

        if ($isCompress) {
            $path .= '.gz';
        }

        return $path;
    }

    /**
     * Get compression request name.
     *
     * @return string
     */
    protected function getCompressionRequestName($assetType)
    {
        $name = '';

        $compressList = [
            'editor',
            'wp',
            'vendor',
            'runtime',
        ];

        $searchKey = $assetType === 'js' ? $_GET['vcv-script'] : $_GET['vcv-style'];

        $key = array_search($searchKey, $compressList);

        if ($key !== false) {
            $name = $compressList[$key];
        }

        return $name;
    }

    /**
     * Check current requested asset type
     *
     * @return string
     */
    protected function getAssetType()
    {
        $type = 'js';

        if (!empty($_GET['vcv-style'])) {
            $type = 'css';
        }

        return $type;
    }

    /**
     * Set current request asset mine type.
     */
    protected function getMimeType()
    {
        $type = 'application/javascript';

        if (!empty($_GET['vcv-style'])) {
            $type = 'text/css';
        }

        return $type;
    }
}
