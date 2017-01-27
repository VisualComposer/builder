<?php

namespace VisualComposer\Helpers;

use VisualComposer\Framework\Illuminate\Support\Helper;
use VisualComposer\Framework\Container;

class Assets extends Container implements Helper
{
    public function getFilePath($filename = '')
    {
        $destinationDir = WP_CONTENT_DIR . '/' . VCV_PLUGIN_ASSETS_DIRNAME . '/assets-bundles';
        vchelper('File')->checkDir($destinationDir);
        $path = $destinationDir . (!empty($filename) ? '/' . $filename : '');

        return $path;
    }

    public function getFileUrl($filename = '')
    {
        $url = WP_CONTENT_URL . '/' . VCV_PLUGIN_ASSETS_DIRNAME . '/assets-bundles' . (!empty($filename) ? '/'
                . $filename : '');

        return $url;
    }
}
