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
        /** @see \VisualComposer\Modules\Assets\BundleController::outputFeBundleScripts */
        $this->addFilter('vcv:frontend:extraOutput', 'outputFeBundleScripts');
        /** @see \VisualComposer\Modules\Assets\BundleController::outputBeBundleScripts */
        $this->addFilter('vcv:backend:extraOutput', 'outputBeBundleScripts');

        /** @see \VisualComposer\Modules\Assets\BundleController::outputVendorBundleScripts */
        $this->addFilter('vcv:backend:extraOutput vcv:frontend:extraOutput', 'outputVendorBundleScripts');
    }

    protected function outputFeBundleScripts($output, Url $urlHelper)
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

    protected function outputBeBundleScripts($output, Url $urlHelper)
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

    protected function outputVendorBundleScripts($output, Url $urlHelper)
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
