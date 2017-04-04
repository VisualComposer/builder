<?php

namespace VisualComposer\Modules\Editors\Frontend;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Url;

class BundleController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Editors\Frontend\BundleController::addHeadBundleStyle */
        $this->addFilter('vcv:frontend:head:extraOutput', 'addHeadBundleStyle');

        /** @see \VisualComposer\Modules\Editors\Frontend\BundleController::addHeadVendorScript */
        $this->addFilter('vcv:frontend:head:extraOutput', 'addHeadVendorScript');

        /** @see \VisualComposer\Modules\Editors\Frontend\BundleController::addFooterBundleScript */
        $this->addFilter('vcv:frontend:footer:extraOutput', 'addFooterBundleScript');
    }

    protected function addHeadBundleStyle($response, $payload, Url $urlHelper)
    {
        // Add CSS
        $response = array_merge(
            (array)$response,
            [
                sprintf(
                    '<link id="vcv-style-fe-bundle" 
rel="stylesheet" property="stylesheet" type="text/css" href="%s" />',
                    $urlHelper->to(
                        'public/dist/wp.bundle.css?' . uniqid()
                    )
                ),
            ]
        );

        return $response;
    }

    protected function addHeadVendorScript($response, $payload, Url $urlHelper)
    {
        // Add Vendor JS
        $response = array_merge(
            (array)$response,
            [
                sprintf(
                    '<script id="vcv-script-vendor-bundle" type="text/javascript" src="%s"></script>',
                    $urlHelper->to(
                        'public/dist/vendor.bundle.js?' . uniqid()
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
                    '<script id="vcv-script-fe-bundle" type="text/javascript" src="%s"></script>',
                    $urlHelper->to(
                        'public/dist/wp.bundle.js?' . uniqid()
                    )
                ),
            ]
        );

        return $response;
    }
}
