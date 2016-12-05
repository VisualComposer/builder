<?php

namespace VisualComposer\Helpers;

use VisualComposer\Framework\Illuminate\Support\Helper;
use VisualComposer\Framework\Container;

class Assets extends Container implements Helper
{
    public function getFilePath($filename = '')
    {
        $uploadDir = wp_upload_dir();
        $destinationDir = $uploadDir['basedir'] . '/' . VCV_PLUGIN_DIRNAME . '/assets-bundles';
        vchelper('File')->checkDir($destinationDir);
        $path = $destinationDir . (!empty($filename) ? '/' . $filename : '');

        return $path;
    }

    public function getFileUrl($filename = '')
    {
        $uploadDir = wp_upload_dir();
        $url = $uploadDir['baseurl'] . '/' . VCV_PLUGIN_DIRNAME . '/assets-bundles' . (!empty($filename) ? '/'
                . $filename : '');

        return $url;
    }
}
