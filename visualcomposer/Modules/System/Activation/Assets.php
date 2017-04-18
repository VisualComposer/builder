<?php

namespace VisualComposer\Modules\System\Activation;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Assets as AssetsHelper;

/**
 * Class Assets
 * @package VisualComposer\Modules\System\Activation
 */
class Assets extends Container implements Module
{
    use EventsFilters;

    /**
     * Assets constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\System\Activation\Assets::copyElementsAssets */
       /* $this->addEvent(
            'vcv:system:activation:hook',
            'copyElementsAssets'
        );*/
    }

    /**
     * @param \VisualComposer\Helpers\Assets $assetsHelper
     */
    protected function copyElementsAssets(AssetsHelper $assetsHelper)
    {
        $path = $assetsHelper->getFilePath('');
        $fontsDir = vcapp()->path() . 'public/sources/attributes/iconpicker/css';
        if ($path) {
            $this->copyDirectoryContent($fontsDir, $path);
        }
    }

    /**
     * @param $src
     * @param $dist
     */
    protected function copyDirectoryContent($src, $dist)
    {
        if (!mkdir($dist)) {
            return;
        }
        $dir = opendir($src);

        while (false !== ($file = readdir($dir))) {
            if (($file != '.') && ($file != '..')) {
                if (is_dir($src . '/' . $file)) {
                    $this->copyDirectoryContent($src . '/' . $file, $dist . '/' . $file);
                } else {
                    copy($src . '/' . $file, $dist . '/' . $file);
                }
            }
        }
        closedir($dir);
    }
}
