<?php

namespace VisualComposer\Modules\Vendors;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Frontend;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Url;

class YoastController extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    public function __construct(Frontend $frontendHelper)
    {
        $this->wpAddAction('plugins_loaded', 'initializeYoast', 16);
    }

    protected function initializeYoast(Frontend $frontendHelper)
    {
        if (isset($GLOBALS['wpseo_metabox'])) {
            if ($frontendHelper->isFrontend()) {
                $this->removeFeScript();
            } else {
                /** @see \VisualComposer\Modules\Vendors\YoastController::enqueueVendorBackend */
                //  $this->wpAddAction('admin_enqueue_scripts', 'enqueueVendorBackend');
                $this->addFilter('vcv:backend:extraOutput', 'enqueueVendorBackend', 3);
            }
        }
    }

    protected function removeFeScript()
    {
        if (isset($GLOBALS['wpseo_metabox'])) {
            remove_action('admin_enqueue_scripts', [$GLOBALS['wpseo_metabox'], 'enqueue']);
        }
    }

    protected function enqueueVendorBackend($response, $payload, Url $urlHelper)
    {
        // Add Vendor JS
        $response = array_merge(
            (array)$response,
            [
                sprintf(
                    '<script id="vcv-script-vendor-yoast" type="text/javascript" src="%s"></script>',
                    $urlHelper->to(
                        'public/dist/yoast.bundle.js?' . uniqid()
                    )
                ),
            ]
        );

        return $response;
    }
}
