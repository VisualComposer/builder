<?php

namespace VisualComposer\Modules\Editors;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Url;

class VendorBundleController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Editors\VendorBundleController::addVendorScript */
        $this->addFilter('vcv:backend:extraOutput vcv:frontend:head:extraOutput', 'addVendorScript', 1);
    }

    protected function addVendorScript($response, $payload, Url $urlHelper)
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
}
