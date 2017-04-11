<?php

namespace VisualComposer\Modules\Vendors;

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Frontend;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class YoastController extends Container implements Module
{
    use WpFiltersActions;

    public function __construct(Frontend $frontendHelper)
    {
        if ($frontendHelper->isFrontend()) {
            /** @see \VisualComposer\Modules\Vendors\YoastController::removeFEScript */
            $this->wpAddAction('plugins_loaded', 'removeFEScript', 16);
        }
    }

    protected function removeFEScript()
    {
        if (isset($GLOBALS['wpseo_metabox'])) {
            remove_action('admin_enqueue_scripts', [$GLOBALS['wpseo_metabox'], 'enqueue']);
        }
    }
}
