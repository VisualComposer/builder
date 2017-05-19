<?php

namespace VisualComposer\Helpers;

use VisualComposer\Framework\Illuminate\Support\Helper;

class HubTemplates implements Helper
{
    public function getTemplatesPath($path = '')
    {
        $bundleFolder = WP_CONTENT_DIR . '/' . VCV_PLUGIN_ASSETS_DIRNAME . '/templates';
        if ($path) {
            $bundleFolder .= '/' . ltrim($path, '\//');
        }

        return $bundleFolder;
    }
}
