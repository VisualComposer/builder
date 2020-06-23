<?php

namespace VisualComposer\Modules\Settings\Pages;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Modules\Settings\Traits\Page;
use VisualComposer\Modules\Settings\Traits\SubMenu;

/**
 * Class Settings
 * @package VisualComposer\Modules\Settings\Pages
 */
class Settings extends Container implements Module
{
    use Page;
    use SubMenu;
    use EventsFilters;
    use WpFiltersActions;

    /**
     * Page url
     * @var string
     */
    protected $slug = 'vcv-settings';

    /**
     * @see resources/views/settings/pages/index.php
     * @var string
     */
    protected $templatePath = 'settings/pages/index';

    /**
     * Settings constructor.
     */
    public function __construct()
    {
        /** @see \VisualComposer\Modules\Settings\Pages\Settings::addPage */
        $this->wpAddAction(
            'admin_menu',
            'addPage',
            2
        );
    }

    protected function beforeRender()
    {
        $urlHelper = vchelper('Url');
        wp_register_style(
            'vcv:wpVcSettings:style',
            $urlHelper->to('public/dist/wpVcSettings.bundle.css'),
            [],
            VCV_VERSION
        );
        wp_enqueue_style('vcv:wpVcSettings:style');
    }

    /**
     * Register submenu page for vcv-settings
     * @throws \Exception
     */
    protected function addPage()
    {
        $page = [
            'slug' => $this->slug,
            'title' => __('Dashboard', 'visualcomposer'),
            'innerTitle' => __('Settings', 'visualcomposer'),
            'subTitle' => __('General', 'visualcomposer'),
            'layout' => 'dashboard-tab-content-standalone',
            'capability' => 'edit_pages',
            'iconClass' => 'vcv-ui-icon-dashboard-settings',
            'isDashboardPage' => true,
        ];
        $this->addSubmenuPage($page);
    }

    public function getMainPageSlug()
    {
        $currentUserAccess = vchelper('AccessCurrentUser');
        $gettingStartedController = vcapp('LicensePagesGettingStarted');
        $hasAccess = $currentUserAccess->wpAll('edit_pages')->part('settings')->can('vcv-settings')->get();

        if ($hasAccess) {
            $pageSlug = $this->getSlug();
        } else {
            $pageSlug = $gettingStartedController->getSlug();
        }

        return $pageSlug;
    }
}
