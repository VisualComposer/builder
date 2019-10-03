<?php

namespace VisualComposer\Modules\Development;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;

class DevAssets extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        if (vcvenv('VCV_ENV_DEV_ADDONS')) {
            $this->addFilter('vcv:helper:assetsShared:getLibraries', 'addSharedLibraries');
        }
    }

    protected function addSharedLibraries($libraries)
    {
        // In development we may have all assets
        $file = VCV_PLUGIN_DIR_PATH . 'devAssets/iconpicker/public/sources/assetsLibrary/assetsLibraries.json';
        if (file_exists($file)) {
            $parsed = json_decode(file_get_contents($file), true);

            if ($parsed['assetsLibrary'][0]['name'] === 'iconpicker') {
                $paths = [];
                foreach ($parsed['assetsLibrary'][0]['cssSubsetBundles'] as $key => $val) {
                    $path = str_replace(
                        '[publicPath]/',
                        VCV_PLUGIN_URL
                        . 'devAssets/iconpicker/public/sources/assetsLibrary/iconpicker/',
                        $val
                    );
                    $paths[ $key ] = $path;
                }
                $libraries['iconpicker']['cssSubsetBundles'] = $paths;
            }
        }

        return $libraries;
    }
}
