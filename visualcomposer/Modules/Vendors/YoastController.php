<?php

namespace VisualComposer\Modules\Vendors;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Frontend;
use VisualComposer\Helpers\Traits\WpFiltersActions;

class YoastController extends Container implements Module
{
    use WpFiltersActions;

    public function __construct()
    {
        $this->wpAddAction('plugins_loaded', 'initializeYoast', 16);
    }

    protected function initializeYoast(Frontend $frontendHelper)
    {
        if (isset($GLOBALS['wpseo_metabox']) && $frontendHelper->isFrontend()) {
            $this->removeFeScript();
        }

        if (!isset($GLOBALS['post_ID']) && $frontendHelper->isFrontend()) {
            $this->setGlobalPostId();
        }
    }

    protected function removeFeScript()
    {
        if (isset($GLOBALS['wpseo_metabox'])) {
            remove_action('admin_enqueue_scripts', [$GLOBALS['wpseo_metabox'], 'enqueue']);
        }
    }

    protected function setGlobalPostId()
    {
        $requestHelper = vchelper('Request');
        $GLOBALS['post_ID'] = $requestHelper->input('vcv-source-id');
    }
}
