<?php

namespace VisualComposer\Modules\Editors\Backend;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Assets;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Url;

class BundleController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        if (vcvenv('VCV_TF_DISABLE_BE')) {
            return;
        }
        /** @see \VisualComposer\Modules\Editors\Backend\BundleController::addHeadBundleStyle */
        $this->addFilter('vcv:backend:extraOutput', 'addHeadBundleStyle');

        /** @see \VisualComposer\Modules\Editors\Backend\BundleController::addFooterBundleScript */
        $this->addFilter('vcv:backend:extraOutput', 'addFooterBundleScript', 2);
    }

    protected function addHeadBundleStyle($response, $payload, Url $urlHelper, Assets $assetsHelper)
    {
        // Add CSS
        $response = array_merge(
            (array)$response,
            [
                sprintf(
                    '<link id="vcv-style-be-bundle" 
rel="stylesheet" property="stylesheet" type="text/css" href="%s" />',
                    vcvenv('VCV_ENV_EXTENSION_DOWNLOAD')
                        ?
                        $assetsHelper->getAssetUrl('/editor/wpbackend.bundle.css?v=' . VCV_VERSION)
                        // TODO: Check latest downloaded version
                        :
                        $urlHelper->to('public/dist/wpbackend.bundle.css?v=' . VCV_VERSION)
                ),
            ]
        );

        return $response;
    }

    protected function addFooterBundleScript($response, $payload, Url $urlHelper, Assets $assetsHelper)
    {
        // Add JS
        $response = array_merge(
            (array)$response,
            [
                sprintf(
                    '<script id="vcv-script-be-bundle" type="text/javascript" src="%s"></script>',
                    vcvenv('VCV_ENV_EXTENSION_DOWNLOAD')
                        ?
                        $assetsHelper->getAssetUrl('/editor/wpbackend.bundle.js?v=' . VCV_VERSION)
                        // TODO: Check latest downloaded version
                        :
                        $urlHelper->to('public/dist/wpbackend.bundle.js?v=' . VCV_VERSION)
                ),
            ]
        );

        return $response;
    }
}
