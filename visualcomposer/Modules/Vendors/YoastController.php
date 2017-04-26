<?php

namespace VisualComposer\Modules\Vendors;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Frontend;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Url;

class YoastController extends Container implements Module
{
    use WpFiltersActions;

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
                $this->enqueueVendorBackend();
            }
        }
    }

    protected function removeFeScript()
    {
        if (isset($GLOBALS['wpseo_metabox'])) {
            remove_action('admin_enqueue_scripts', [$GLOBALS['wpseo_metabox'], 'enqueue']);
            /** @see \VisualComposer\Modules\Vendors\YoastController::enqueueVendor */
            $this->wpAddAction('enqueue_scripts', 'enqueueVendor');
        }
    }

    protected function enqueueVendorBackend()
    {
        $urlHelper = vchelper('Url');
        wp_enqueue_script('vcv:vendors:yoast:script', $urlHelper->to('public/dist/yoast.bundle.js'));
    }
}
