<?php

namespace VisualComposer\Helpers\Hub;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Helper;

class SharedLibraries implements Helper
{
    public function getLibraryPath($path = '')
    {
        $bundleFolder = VCV_PLUGIN_ASSETS_DIR_PATH . '/sharedLibraries';
        if ($path) {
            $bundleFolder .= '/' . ltrim($path, '\//');
        }

        return $bundleFolder;
    }

    public function getLibraryUrl($path = '')
    {
        $bundleFolder = content_url() . '/' . VCV_PLUGIN_ASSETS_DIRNAME . '/sharedLibraries';
        if ($path) {
            $bundleFolder .= '/' . ltrim($path, '\//');
        }

        return $bundleFolder;
    }
}
