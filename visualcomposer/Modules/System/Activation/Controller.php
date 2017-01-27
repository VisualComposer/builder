<?php

namespace VisualComposer\Modules\System\Activation;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Assets;

/**
 * Class Controller.
 */
class Controller extends Container implements Module
{
    use WpFiltersActions;

    /**
     * Controller constructor.
     */
    public function __construct(Assets $assetsHelper)
    {
        $this->assetsHelper = $assetsHelper;

        $file = plugin_basename(VCV_PLUGIN_FULL_PATH);
        // register_activation_hook
        /** @see \VisualComposer\Modules\System\Activation\Controller::setVersion */
        $this->wpAddAction(
            'activate_' . $file,
            'setVersion'
        );
        $this->wpAddAction(
            'activate_' . $file,
            'copyElementsAssets'
        );
    }

    /**
     * @param \VisualComposer\Helpers\Options $options
     */
    private function setVersion(Options $options)
    {
        $options->set('version', VCV_VERSION);
    }

    private function copyElementsAssets()
    {
        $path = $this->assetsHelper->getFilePath('');
        $fontsDir = vcapp()->path() . 'public/sources/attributes/iconpicker/css';
        if ($path) {
            $this->copyDirectoryContent($fontsDir, $path);
        }
    }

    private function copyDirectoryContent($src, $dist)
    {
        $dir = opendir($src);
        @mkdir($dist);
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
