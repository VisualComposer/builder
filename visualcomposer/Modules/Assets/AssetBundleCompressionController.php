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
        $name = $this->getCompressionRequestName();
        if (!$name) {
            return;
        }

        if (strpos($_SERVER['HTTP_ACCEPT_ENCODING'], 'gzip') === false) {
            // browser cannot accept compressed content, so need output standard JS/CSS
            echo file_get_contents(VCV_PLUGIN_DIR_PATH . '/public/dist/' . $name . '.bundle.js');
        } else {
            error_reporting(0);
            header("Content-Encoding: gzip");
            header("Content-Type: application/javascript");

            if ($this->isPhpGzCompression()) {
                echo file_get_contents(VCV_PLUGIN_DIR_PATH . '/public/dist/' . $name . '.bundle.js');
            } else {
                echo file_get_contents(VCV_PLUGIN_DIR_PATH . '/public/dist/' . $name . '.bundle.js.gz');
            }
        }

        exit;
    }

    /**
     * Check if php compression is enabled.
     *
     * @return bool
     */
    protected function isPhpGzCompression()
    {
        if (in_array('ob_gzhandler', ob_list_handlers())) {
            return true;
        }

        if (ini_get('zlib.output_compression')) {
            return true;
        }

        return false;
    }

    /**
     * Get compression request name.
     *
     * @return string
     */
    protected function getCompressionRequestName()
    {
        $name = '';

        if (!isset($_GET['vcv-script'])) {
            return $name;
        }

        $compressList = [
            'editor',
            'wp',
            'vendor'
        ];

        $key = array_search($_GET['vcv-script'], $compressList);

        if ($key !== false) {
            $name = $compressList[$key];
        }

        return $name;
    }
}
