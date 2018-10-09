<?php

namespace VisualComposer\Modules\Vendors;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Traits\EventsFilters;

class ThemeTwentySeventeenController extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

    public function __construct()
    {
        $this->addEvent(
            'vcv:assets:enqueueVendorAssets',
            'initialize'
        );
        $this->wpAddAction(
            'customize_partial_render',
            'enqueueAssetsForCustomizePartial',
            50
        );
    }

    protected function initialize()
    {
        if (!function_exists('twentyseventeen_is_static_front_page')) {
            return;
        }
        if (twentyseventeen_is_static_front_page() || is_customize_preview()) {
            $mods = get_theme_mods();
            $pattern = '/panel_/';
            $panels = [];
            foreach ($mods as $key => $mod) {
                if (preg_match($pattern, $key)) {
                    array_push($panels, $mod);
                }
            }
            if (!empty($panels)) {
                vcevent('vcv:assets:enqueueAssets', ['sourceIds' => $panels]);
            }
        }
    }

    protected function enqueueAssetsForCustomizePartial($rendered)
    {
        $panelId = get_query_var('panel');
        if (!$panelId) {
            return;
        }
        global $post;
        $post = get_post(get_theme_mod('panel_' . $panelId));
        setup_postdata($post);
        ob_start();
        vcevent('vcv:assets:enqueueAssets', ['sourceIds' => [$post->ID]]);
        wp_print_styles();
        wp_print_scripts();
        $assets = ob_get_clean();
        wp_reset_postdata();

        return $rendered . $assets;
    }
}
