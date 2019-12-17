<?php

namespace VisualComposer\Modules\System\Cache;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Modules\System\Ajax\Controller;

class CacheController extends Controller implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    public function __construct()
    {
        $this->addEvent('vcv:system:cache:clearCache', 'clearCache');
        $this->wpAddAction(
            'update_option_vcv-settings',
            function () {
                vcevent('vcv:system:cache:clearCache');
            }
        );
        $this->wpAddAction(
            'update_option_vcv-globalElementsCss',
            function () {
                vcevent('vcv:system:cache:clearCache');
            }
        );
        $this->wpAddAction(
            'update_option_vcv-settingsGlobalJsHead',
            function () {
                vcevent('vcv:system:cache:clearCache');
            }
        );
        $this->wpAddAction(
            'update_option_vcv-settingsGlobalJsFooter',
            function () {
                vcevent('vcv:system:cache:clearCache');
            }
        );
        $this->addEvent('vcv:system:factory:reset', 'clearCache');
    }

    protected function clearCache()
    {
        try {
            // WP Super Cache
            if (function_exists('wp_cache_clear_cache')) {
                wp_cache_clear_cache();
            }

            // W3 Total Cahce
            if (function_exists('w3tc_pgcache_flush')) {
                w3tc_pgcache_flush();
            }

            // Clear Litespeed cache
            if (class_exists('LiteSpeed_Cache_API') && method_exists('LiteSpeed_Cache_API', 'purge_all')) {
                \LiteSpeed_Cache_API::purge_all();
            }

            // Site ground
            if (
                class_exists('SG_CachePress_Supercacher')
                && method_exists('SG_CachePress_Supercacher ', 'purge_cache')
            ) {
                \SG_CachePress_Supercacher::purge_cache(true);
            }

            // Endurance Cache
            if (class_exists('Endurance_Page_Cache') && method_exists('Endurance_Page_Cache', 'purge_all')) {
                $e = new \Endurance_Page_Cache();
                $e->purge_all();
            }

            // WP Fastest Cache
            if (
                isset($GLOBALS['wp_fastest_cache'])
                && method_exists($GLOBALS['wp_fastest_cache'], 'deleteCache')
            ) {
                $GLOBALS['wp_fastest_cache']->deleteCache(true);
            }
        } catch (\Exception $e) {
            return;
        }
    }
}
