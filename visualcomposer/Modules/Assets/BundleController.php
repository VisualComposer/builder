<?php

namespace VisualComposer\Modules\Assets;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Url;

class BundleController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Assets\BundleController::addFeBundleScripts */
        $this->addFilter('vcv:frontend:extraOutput', 'addFeBundleScripts');
        /** @see \VisualComposer\Modules\Assets\BundleController::addBeBundleScripts */
        $this->addFilter('vcv:backend:extraOutput', 'addBeBundleScripts');

        /** @see \VisualComposer\Modules\Assets\BundleController::addVendorBundleScripts */
        $this->addFilter('vcv:backend:extraOutput vcv:frontend:extraOutput', 'addVendorBundleScripts');
    }

    protected function addFeBundleScripts($output, Url $urlHelper)
    {
        $output = array_merge(
            $output,
            [
                sprintf(
                    '<script id="vcv-script-fe-bundle" type="text/javascript" src="%s"></script>',
                    $urlHelper->to(
                        'public/dist/wp.bundle.js?' . uniqid()
                    )
                ),
            ]
        );

        return $output;
    }

    protected function addBeBundleScripts($output, Url $urlHelper)
    {
        $output = array_merge(
            $output,
            [
                sprintf(
                    '<script id="vcv-script-be-bundle" type="text/javascript" src="%s"></script>',
                    $urlHelper->to(
                        'public/dist/wp.backend.bundle.js?' . uniqid()
                    )
                ),
            ]
        );

        return $output;
    }

    protected function addVendorBundleScripts($output, Url $urlHelper)
    {
        $output = array_merge(
            $output,
            [
                sprintf(
                    '<script id="vcv-script-vendor-bundle" type="text/javascript" src="%s"></script>',
                    $urlHelper->to(
                        'public/dist/vendor.bundle.js?' . uniqid()
                    )
                ),
            ]
        );

        return $output;
    }
}
