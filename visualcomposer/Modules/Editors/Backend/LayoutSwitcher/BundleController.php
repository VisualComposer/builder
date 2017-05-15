<?php

namespace VisualComposer\Modules\Editors\Backend\LayoutSwitcher;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Frontend;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Url;

class BundleController extends Container implements Module
{
    use EventsFilters;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Editors\Backend\LayoutSwitcher\BundleController::addHeadBundleStyle */
        $this->addFilter('vcv:backend:extraOutput', 'addHeadBundleStyle');

        /** @see \VisualComposer\Modules\Editors\Backend\LayoutSwitcheBundleController::addFooterBundleScript */
        $this->addFilter('vcv:backend:extraOutput', 'addFooterBundleScript', 4);
    }

    protected function addHeadBundleStyle(array $response, $payload, Url $urlHelper)
    {
        // Add CSS
        $response = array_merge(
            $response,
            [
                sprintf(
                    '<link id="vcv-style-be-switch-bundle" 
rel="stylesheet" property="stylesheet" type="text/css" href="%s" />',
                    $urlHelper->to(
                        'public/dist/wpbackendswitch.bundle.css?' . uniqid()
                    )
                ),
            ]
        );

        return $response;
    }

    protected function addFooterBundleScript(array $response, $payload, Url $urlHelper, Frontend $frontendHelper)
    {
        // Add JS
        $scriptBody = sprintf('window.vcvFrontendEditorLink = "%s";', $frontendHelper->getFrontendUrl());
        $response = array_merge(
            $response,
            [
                sprintf(
                    '<script type="text/javascript">%s</script>',
                    $scriptBody
                ),
            ]
        );
        $response = array_merge(
            $response,
            [
                sprintf(
                    '<script id="vcv-script-be-switch-bundle" type="text/javascript" src="%s"></script>',
                    $urlHelper->to(
                        'public/dist/wpbackendswitch.bundle.js?' . uniqid()
                    )
                ),
            ]
        );

        return $response;
    }
}
