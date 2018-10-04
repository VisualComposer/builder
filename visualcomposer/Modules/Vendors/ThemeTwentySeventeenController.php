<?php

namespace VisualComposer\Modules\Vendors;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Assets;
use VisualComposer\Helpers\AssetsShared;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Str;
use VisualComposer\Modules\Assets\EnqueueController;

class ThemeTwentySeventeenController extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    public function __construct()
    {
        $this->wpAddAction('init', 'initialize');
    }

    protected function initialize()
    {
        if (!defined('WPB_VC_VERSION')) {
            return;
        }

        $this->addEvent('vcv:assets:enqueueAssets', 'enqueueAssets');
        $this->addEvent('vcv:assets:enqueueSourceAssets', 'enqueueSourceAssets');
    }

    protected function enqueueAssets(EnqueueController $enqueueController, Str $strHelper, Assets $assetsHelper, AssetsShared $assetsSharedHelper, Options $optionsHelper)
    {
        if (function_exists('twentyseventeen_is_static_front_page') && (twentyseventeen_is_static_front_page() || is_customize_preview())) {
            $mods = get_theme_mods();
            $pattern = '/panel_/';
            $panels = [];
            foreach ($mods as $key => $mod) {
                if (preg_match($pattern, $key)) {
                    array_push($panels, $mod);
                }
            }
            if (!empty($panels)) {
                $enqueueController->enqueueAssetsListener($strHelper, $assetsHelper, $assetsSharedHelper, $optionsHelper, $panels);
            }
        }
    }

    protected function enqueueSourceAssets(EnqueueController $enqueueController, Str $strHelper, Assets $assetsHelper)
    {
        if (function_exists('twentyseventeen_is_static_front_page') && (twentyseventeen_is_static_front_page() || is_customize_preview())) {
            $mods = get_theme_mods();
            $pattern = '/panel_/';
            $panels = [];
            foreach ($mods as $key => $mod) {
                if (preg_match($pattern, $key)) {
                    array_push($panels, $mod);
                }
            }
            if (!empty($panels)) {
                $enqueueController->enqueueSourceAssetsListener($strHelper, $assetsHelper, $panels);
            }
        }
    }
}
