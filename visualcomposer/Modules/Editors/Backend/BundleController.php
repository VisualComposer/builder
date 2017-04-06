<?php

namespace VisualComposer\Modules\Editors\Backend;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Url;

class BundleController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Editors\Backend\BundleController::addHeadBundleStyle */
        $this->addFilter('vcv:backend:extraOutput', 'addHeadBundleStyle');

        /** @see \VisualComposer\Modules\Editors\Backend\BundleController::addFooterBundleScript */
        $this->addFilter('vcv:backend:extraOutput', 'addFooterBundleScript', 2);
    }

    protected function addHeadBundleStyle($response, $payload, Url $urlHelper)
    {
        // Add CSS
        $response = array_merge(
            (array)$response,
            [
                sprintf(
                    '<link id="vcv-style-be-bundle" 
rel="stylesheet" property="stylesheet" type="text/css" href="%s" />',
                    $urlHelper->to(
                        'public/dist/wpbackend.bundle.css?' . uniqid()
                    )
                ),
            ]
        );

        return $response;
    }

    protected function addFooterBundleScript($response, $payload, Url $urlHelper)
    {
        // Add JS
        $response = array_merge(
            (array)$response,
            [
                sprintf(
                    '<script id="vcv-script-be-bundle" type="text/javascript" src="%s"></script>',
                    $urlHelper->to(
                        'public/dist/wpbackend.bundle.js?' . uniqid()
                    )
                ),
            ]
        );

        return $response;
    }
}
