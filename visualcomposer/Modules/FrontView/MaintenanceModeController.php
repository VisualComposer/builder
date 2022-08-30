<?php

namespace VisualComposer\Modules\FrontView;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Access\CurrentUser;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use WP_Query;

class MaintenanceModeController extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    public function __construct()
    {
        $this->wpAddAction(
            'template_redirect',
            'renderMaintenancePage',
            100
        );

        $this->wpAddAction('wp_loaded', 'initStyles');
    }

    protected function initStyles()
    {
        if (self::isMaintenanceMode()) {
            $css = '#wpadminbar .vcv-maintenance-mode-active > .ab-item{color:#fff;background-color: #f44;}';
            $css .= '#wpadminbar .vcv-maintenance-active:hover > .ab-item{background-color: #aa1000 !important;}';

            wp_register_style('vcv:assets:maintenanceMode', false);
            wp_enqueue_style('vcv:assets:maintenanceMode');
            wp_add_inline_style('vcv:assets:maintenanceMode', $css);
        }
    }

    public static function isMaintenanceMode()
    {
        $optionsHelper = vchelper('Options');
        $frontendHelper = vchelper('Frontend');
        $isEnabled = $optionsHelper->get('settings-maintenanceMode-enabled', '');
        if ($isEnabled && !$frontendHelper->isPageEditable()) {
            $sourceId = (int)$optionsHelper->get('settings-maintenanceMode-page', '');
            if ($sourceId) {
                $sourceId = apply_filters('wpml_object_id', $sourceId, 'post', true);
                $post = get_post($sourceId);
                // Reset in case if post not published/removed
                // @codingStandardsIgnoreLine
                if ($post && $post->post_status === 'publish') {
                    return $sourceId;
                }
            }
        }

        return false;
    }

    protected function renderMaintenancePage(CurrentUser $accessCurrentUserHelper)
    {
        $globalsHelper = vchelper('Globals');

        $id = self::isMaintenanceMode();

        if ($id && !$accessCurrentUserHelper->wpAll('edit_pages')->get()) {
            $this->headers();
            //            $post = get_post($id);
            $queriedPost = get_post($id);
            $globalsHelper->set('post', $queriedPost);
            $id = $queriedPost->ID; // in case if translated
            // @codingStandardsIgnoreLine
            $tempQuery = new WP_Query(
                [
                    'suppress_filters' => true,
                    'post_type' => 'page',
                    'p' => $id,
                ]
            ); // set local current query
            $globalsHelper->set('wp_query', $tempQuery);
            // @codingStandardsIgnoreLine
            $tempGlobalQuery = new WP_Query(
                [
                    'suppress_filters' => true,
                    'post_type' => 'page',
                    'p' => $id,
                ]
            ); // set global query also!
            $globalsHelper->set('wp_the_query', $tempGlobalQuery);
            $template = get_page_template();
            if (!$template) {
                $template = get_index_template();
            }
            if ($template = apply_filters('template_include', $template)) {
                include $template;
            }
            exit;
        }
    }

    protected function headers()
    {
        // Default headers for 503 maintenance
        @header('HTTP/1.1 503 Service Temporarily Unavailable');
        @header('Status: 503 Service Temporarily Unavailable');
        // 30min delay
        @header('Retry-After: 1800');

        // Set Disable WordPress caching
        if (!defined('DONOTCACHEPAGE')) {
            define('DONOTCACHEPAGE', true);
        }
        if (!defined('DONOTCDN')) {
            define('DONOTCDN', true);
        }
        if (!defined('DONOTCACHEDB')) {
            define('DONOTCACHEDB', true);
        }
        if (!defined('DONOTMINIFY')) {
            define('DONOTMINIFY', true);
        }
        if (!defined('DONOTCACHEOBJECT')) {
            define('DONOTCACHEOBJECT', true);
        }
        nocache_headers();
    }
}
