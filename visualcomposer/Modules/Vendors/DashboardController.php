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

class DashboardController extends Container implements Module
{
    use WpFiltersActions;

    protected $itemsCount = 3;

    public function __construct()
    {
        $this->wpAddAction('wp_dashboard_setup', 'createNewsWidget');
        $this->wpAddAction('wp_network_dashboard_setup', 'createNewsWidget');
    }

    /**
     * Create Visual Composer News Widget in WordPress Dashboard
     */
    protected function createNewsWidget()
    {
        wp_add_dashboard_widget(
            'visualcomposer-blog-dashboard',
            esc_html__('Visual Composer News', 'visualcomposer'),
            function () {
                $rssItems = $this->getRssData();
                evcview('vendors/dashboard', ['rssItems' => $rssItems]);
            }
        );
    }

    /**
     * Get RSS Data
     * @return array|bool|null
     */
    protected function getRssData()
    {
        $result = false;
        $rss = fetch_feed('https://visualcomposer.com/blog/feed/');
        if (!is_wp_error($rss)) {
            $maxItems = $rss->get_item_quantity($this->itemsCount);
            $result = $rss->get_items(0, $maxItems);
        }

        return $result;
    }
}
