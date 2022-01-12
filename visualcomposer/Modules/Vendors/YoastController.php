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
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;


class YoastController extends Container implements Module
{
    use EventsFilters;
    use WpFiltersActions;

    public function __construct()
    {
        $this->wpAddAction('plugins_loaded', 'initialize');
    }

    protected function initialize()
    {
        if (!function_exists('YoastSEO')) {
            return;
        }

        $this->addEvent('vcv:inited', 'initializeYoast', 11);
        $this->wpAddFilter(
            'wpseo_frontend_presentation',
            'overrideFrontendOutput',
            10,
            1
        );
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

    /**
     * For our layout temples where we completely rewrite global query we need return it for initial pages.
     *
     * @param array $contextPresentation
     *
     * @return array
     */
    protected function overrideFrontendOutput($contextPresentation)
    {
        // @codingStandardsIgnoreStart
        global $wp_query, $wp_the_query;

        if (
            empty($wp_query->query['queriedPage']) ||
            empty($wp_the_query->query['queriedPage']) ||
            empty($contextPresentation->model)
        ) {
            return $contextPresentation;
        }

        $backWpQuery = $wp_query;
        $backupWpTheQuery = $wp_the_query;

        $wp_query = $backWpQuery->query['queriedPage'];
        $wp_the_query = $backupWpTheQuery->query['queriedPage'];

        $repository = YoastSEO()->classes->get('Yoast\WP\SEO\Repositories\Indexable_Repository');
        $model = $repository->for_current_page();

        if ($model) {
            $contextPresentation->model = $model;
        }

        $wp_query = $backWpQuery;
        $wp_the_query = $backupWpTheQuery;
        // @codingStandardsIgnoreEnd

        return $contextPresentation;
    }
}
