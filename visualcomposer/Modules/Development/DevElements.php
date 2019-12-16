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
        // Test code
        $x = 1;
        if ($x) {
            echo '1';
        } elseif ($x || !$x) {
            echo '1';
        }
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
        if (!$optionHelper->getTransient('devElementsCache')) {
            $manifests = $app->glob($app->path('devElements/*/manifest.json'));
            $elements = $this->readManifests($manifests);
            $optionHelper->setTransient('devElementsCache', true, 30);
            $optionHelper->set(
                'hubElements',
                $elements
            );
        }
    }

    /**
     * @param array $manifests
     *
     * @return array
     * @throws \Exception
     */
    protected function readManifests(array $manifests)
    {
        $elements = [];
        $urlHelper = vchelper('Url');
        $vcapp = vcapp();
        foreach ($manifests as $manifestPath) {
            $manifest = json_decode(file_get_contents($manifestPath), true);
            $dirname = dirname($manifestPath);
            $tag = basename($dirname);
            if (!isset($manifest['elements'], $manifest['elements'][ $tag ])) {
                throw new \Exception('Element manifest must SET "TAG":' . $manifestPath);
            }
            $element = $manifest['elements'][ $tag ];
            $element['bundlePath'] = $urlHelper->to(
                'devElements/' . $tag . '/public/dist/element.bundle.js'
            );
            $element['elementPath'] = $urlHelper->to('devElements/' . $tag . '/' . $tag . '/');
            $element['elementRealPath'] = $vcapp->path('devElements/' . $tag . '/' . $tag . '/');
            $element['assetsPath'] = $urlHelper->to('devElements/' . $tag . '/' . $tag . '/public/');
            $element['phpFiles'] = [];
            if (isset($manifest['elements'], $manifest['elements'][ $tag ], $manifest['elements'][ $tag ]['phpFiles'])) {
                $files = $manifest['elements'][ $tag ]['phpFiles'];
                foreach ($files as $index => $filePath) {
                    $manifest['elements'][ $tag ]['phpFiles'][ $index ] = rtrim($element['elementRealPath'], '\\/') . '/' . $filePath;
                }
                unset($index, $filePath);
                $element['phpFiles'] = $manifest['elements'][ $tag ]['phpFiles'];
            }
            $element = json_decode(
                str_replace(
                    '[publicPath]',
                    $urlHelper->to('devElements/' . $tag . '/' . $tag . '/public'),
                    json_encode($element)
                ),
                true
            );

            $elements[ $tag ] = $element;
        }
        unset($manifest, $manifestPath, $tag, $dirname);

        return $elements;
    }
}
