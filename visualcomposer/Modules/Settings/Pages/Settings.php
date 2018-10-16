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
        /** @see \VisualComposer\Modules\Settings\Pages\PostTypes::addPage */
        $this->wpAddAction(
            'admin_menu',
            'addPage',
            1
        );
    }

    /**
     * Register submenu page for vcv-settings
     * @throws \Exception
     */
    protected function addPage()
    {
        $page = [
            'slug' => $this->slug,
            'title' => __('Settings', 'vcwb'),
            'showTab' => false,
            'layout' => 'settings-standalone',
            'controller' => $this,
            'capability' => 'manage_options',
        ];
        $this->addSubmenuPage($page);
    }
}
