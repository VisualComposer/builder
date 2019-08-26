<?php

namespace VisualComposer\Modules\FrontView;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Application;
use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Assets;
use VisualComposer\Helpers\File;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;

class AssetResetController extends Container implements Module
{
    use EventsFilters;

    protected $replaceCount = 0;

    public function __construct()
    {
        if (vcvenv('VCV_TF_ASSETS_URLS_FACTORY_RESET')) {
            /** @see \VisualComposer\Modules\FrontView\AssetResetController::updateCssFiles */
            $this->addEvent(
                'vcv:system:factory:reset',
                'updateCssFiles',
                100
            );
        }
    }

    protected function updateCssFiles(Assets $assetsHelper, File $fileHelper, Options $optionsHelper)
    {
        $status = false;
        $destinationDir = $assetsHelper->getFilePath();

        /** @var Application $app */
        $app = vcapp();
        $files = $app->glob(rtrim($destinationDir, '/\\') . '/*.css');
        if (is_array($files)) {
            foreach ($files as $file) {
                $content = $fileHelper->getContents($file);
                if (!empty($content)) {
                    $siteUrls = $optionsHelper->get('siteUrls');
                    $this->replaceCount = 0;
                    $content = str_replace(
                        $siteUrls['prevUrls'],
                        $siteUrls['currentUrl'],
                        $content,
                        $this->replaceCount
                    );
                    if ($this->replaceCount > 0) {
                        $fileHelper->setContents($file, $content);
                    }
                }
            }
        }

        return $status;
    }
}
