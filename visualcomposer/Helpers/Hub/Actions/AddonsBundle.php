<?php

namespace VisualComposer\Helpers\Hub\Actions;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;

class AddonsBundle extends ElementsBundle implements Helper
{
    /** @noinspection PhpMissingParentConstructorInspection */
    /**
     * AddonsBundle constructor.
     */
    public function __construct()
    {
        $this->bundlePath = VCV_PLUGIN_ASSETS_DIR_PATH . '/temp-bundle-addons';
    }

    public function requestBundleDownload()
    {
        list ($data, $action) = func_get_args(); // To make declaration of method compatible of parent
        $url = $data['url'];
        $addonTag = explode('/', $action);
        $this->bundlePath = VCV_PLUGIN_ASSETS_DIR_PATH . '/temp-bundle-addons-' . $addonTag[1];
        $fileHelper = vchelper('File');
        $downloadedArchive = $fileHelper->download($url);

        return $downloadedArchive;
    }
}
