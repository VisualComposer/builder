<?php

namespace VisualComposer\Modules\Editors\Frontend;

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
        /** @see \VisualComposer\Modules\Editors\Frontend\BundleController::addHeadBundleStyle */
        $this->addFilter('vcv:frontend:head:extraOutput', 'addHeadBundleStyle');

        /** @see \VisualComposer\Modules\Editors\Frontend\BundleController::addFooterBundleScript */
        $this->addFilter('vcv:frontend:footer:extraOutput', 'addFooterBundleScript');
    }

    protected function addHeadBundleStyle($response, $payload, Url $urlHelper, Assets $assetsHelper)
    {
        if (vcfilter('vcv:frontend:enqueue:bundle', true)) {
            // Add CSS
            $response = array_merge(
                (array)$response,
                [
                    sprintf(
                        '<link id="vcv-style-fe-bundle" 
rel="stylesheet" property="stylesheet" type="text/css" href="%s" />',
                        $urlHelper->to('public/dist/wp.bundle.css?v=' . VCV_VERSION)
                    ),
                ]
            );
        }

        return $response;
    }

    protected function addFooterBundleScript($response, $payload, Url $urlHelper, Assets $assetsHelper)
    {
        if (vcfilter('vcv:frontend:enqueue:bundle', true)) {
            // Add JS
            $response = array_merge(
                (array)$response,
                [
                    sprintf(
                        '<script id="vcv-script-fe-bundle" type="text/javascript" src="%s"></script>',
                        $urlHelper->to('public/dist/wp.bundle.js?v=' . VCV_VERSION)
                    ),
                ]
            );
        }

        return $response;
    }
}
