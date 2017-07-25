<?php

namespace VisualComposer\Helpers\Hub\Actions;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;
use VisualComposer\Helpers\Hub\Bundle;

class ElementsBundle extends Bundle implements Helper
{
    /** @noinspection PhpMissingParentConstructorInspection */
    /**
     * ElementsBundle constructor.
     */
    public function __construct()
    {
        $this->bundlePath = VCV_PLUGIN_ASSETS_DIR_PATH . '/temp-bundle-elements';
    }

    public function requestBundleDownload()
    {
        list ($url) = func_get_args(); // To make declaration of method compatible of parent
        $fileHelper = vchelper('File');
        $downloadedArchive = $fileHelper->download($url);

        return $downloadedArchive;
    }
}
