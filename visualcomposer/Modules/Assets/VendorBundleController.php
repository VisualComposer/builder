<?php

namespace VisualComposer\Modules\Assets;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Url;

class VendorBundleController extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Assets\VendorBundleController::addVendorScript */
        $this->addFilter('vcv:backend:extraOutput vcv:frontend:head:extraOutput', 'addVendorScript', 1);

        $this->wpAddAction('wp_enqueue_scripts', 'enqueueVendorFrontScripts', 1);
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

    protected function enqueueVendorFrontScripts(Url $urlHelper)
    {
        wp_enqueue_script('jquery'); // Required for 3-rd elements libraries
        wp_enqueue_script(
            'vcv:assets:vendor:script',
            $urlHelper->to(
                'public/dist/vendor.bundle.js?' . uniqid()
            )
        );
        wp_enqueue_script(
            'vcv:assets:front:script',
            $urlHelper->to(
                'public/dist/front.bundle.js?' . uniqid()
            ),
            [
                'vcv:assets:vendor:script',
            ]
        );
    }
}
