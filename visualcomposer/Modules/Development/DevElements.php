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

class DevElements extends Container implements Module
{
    use WpFiltersActions;

    public function __construct()
    {
        if (vcvenv('VCV_ENV_DEV_ELEMENTS')) {
            $this->wpAddAction(
                'init',
                'dummySetElements'
            );
        }
    }

    /**
     * @param \VisualComposer\Helpers\Options $optionHelper
     *
     * @param \VisualComposer\Application $app
     *
     * @throws \Exception
     */
    protected function dummySetElements(Options $optionHelper, Application $app)
    {
        $manifests = $app->rglob($app->path('devElements/*/manifest.json'));
        $elements = $this->readManifests($manifests);
        $optionHelper->set(
            'hubElements',
            $elements
        );
    }

    /**
     * @param array $manifests
     *
     * @return array
     * @throws \Exception
     */
    protected function readManifests(array $manifests)
    {
        $addons = [];
        $urlHelper = vchelper('Url');
        foreach ($manifests as $manifestPath) {
            $manifest = json_decode(file_get_contents($manifestPath), true);
            $dirname = dirname($manifestPath);
            $tag = basename($dirname);
            if (!isset($manifest['elements'], $manifest['elements'][ $tag ])) {
                throw new \Exception('Element manifest must SET "TAG":' . $manifestPath);
            }
            $element = $manifest['element'][ $tag ];
            if (isset($manifest['phpFiles'])) {
                $files = $manifest['phpFiles'];
                foreach ($files as $index => $filePath) {
                    $files[ $index ] = rtrim($dirname, '\\/') . '/' . $filePath;
                }
                unset($index, $filePath);
                $element['phpFiles'] = $files;
            }
            $element['bundlePath'] = $urlHelper->to(
                'devElements/' . $tag . '/public/dist/element.bundle.js'
            );
            $element['elementPath'] = $urlHelper->to('devElements/' . $tag . '/' . $tag . '/');
            $element['elementRealPath'] = vcapp()->path('devElements/' . $tag . '/' . $tag . '/');
            $element['assetsPath'] = $urlHelper->to('devElements/' . $tag . '/' . $tag . '/public/');
            $element = json_decode(
                str_replace(
                    '[publicPath]',
                    $urlHelper->to('devElements/' . $tag . '/' . $tag . '/public'),
                    json_encode($element)
                ),
                true
            );

            $addons[ $tag ] = $element;
        }
        unset($manifest, $manifestPath, $tag, $dirname);

        return $addons;
    }
}
