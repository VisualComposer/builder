<?php

namespace VisualComposer\Modules\Development;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Application;
use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class DevAddons extends Container implements Module
{
    use WpFiltersActions;

    public function __construct()
    {
        if (vcvenv('VCV_ENV_DEV_ADDONS')) {
            $this->wpAddAction(
                'init',
                'dummySetAddons'
            );
        }
    }

    /**
     * @param \VisualComposer\Helpers\Options $optionHelper
     * @param \VisualComposer\Application $app
     */
    protected function dummySetAddons(Options $optionHelper, Application $app)
    {
        $manifests = $app->glob($app->path('devAddons/*/manifest.json'));
        $addons = $this->readManifests($manifests);
        $optionHelper->set(
            'hubAddons',
            $addons
        );
    }

    protected function readManifests(array $manifests)
    {
        $addons = [];
        $vcapp = vcapp();
        foreach ($manifests as $manifestPath) {
            $manifest = json_decode(file_get_contents($manifestPath), true);
            $dirname = dirname($manifestPath);
            $tag = basename($dirname);
            if (isset($manifest['phpFiles'])) {
                $files = $manifest['phpFiles'];
                foreach ($files as $index => $filePath) {
                    $manifest['phpFiles'][ $index ] = rtrim($dirname, '\\/') . '/' . $filePath;
                }
                unset($index, $filePath);
            }
            $manifest['addonRealPath'] = $vcapp->path('devAddons/' . $tag . '/' . $tag . '/');
            $addons[ $tag ] = $manifest;
        }
        unset($manifest, $manifestPath, $tag, $dirname);

        return $addons;
    }
}
