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
            9
        );
    }

    protected function beforeRender()
    {
        $urlHelper = vchelper('Url');
        wp_register_style(
            'vcv:wpUpdate:style',
            $urlHelper->to('public/dist/wpUpdate.bundle.css'),
            [],
            VCV_VERSION
        );
        wp_enqueue_style('vcv:wpUpdate:style');
    }

    /**
     * Register submenu page for vcv-settings
     * @throws \Exception
     */
    protected function addPage()
    {
        $layout = 'settings-standalone';

        if (vcvenv('VCV_ENV_FT_SYSTEM_CHECK_LIST')) {
            $layout = 'settings-standalone-with-tabs';
        }

        $page = [
            'slug' => $this->slug,
            'title' => __('Settings', 'vcwb'),
            'showTab' => false,
            'layout' => $layout,
            'controller' => $this,
            'capability' => 'edit_pages',
        ];
        $this->addSubmenuPage($page);
    }

    public function getMainPageSlug()
    {
        $currentUserAccess = vchelper('AccessCurrentUser');
        $aboutConroller = vcapp('SettingsPagesAbout');
        $gettingStartedController = vcapp('LicensePagesGettingStarted');
        $licenseHelper = vchelper('License');
        $hasAccess = $currentUserAccess->wpAll('edit_pages')->part('settings')->can('vcv-settings')->get();

        if ($hasAccess) {
            $pageSlug = $this->getSlug();
        } else {
            if ($licenseHelper->isActivated()) {
                $pageSlug = $aboutConroller->getSlug();
            } else {
                $pageSlug = $gettingStartedController->getSlug();
            }
        }

        return $pageSlug;
    }
}
