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
        if (vcvenv('VCV_FT_ACTIVATION_REDESIGN')) {
            wp_register_style(
                'vcv:wpUpdateRedesign:style',
                $urlHelper->assetUrl('dist/wpUpdateRedesign.bundle.css'),
                [],
                VCV_VERSION
            );
            wp_enqueue_style('vcv:wpUpdateRedesign:style');
        } else {
            wp_register_script(
                'vcv:settings:script',
                $urlHelper->assetUrl('dist/wpsettings.bundle.js'),
                [],
                VCV_VERSION
            );
            wp_register_style(
                'vcv:settings:style',
                $urlHelper->assetUrl('dist/wpsettings.bundle.css'),
                [],
                VCV_VERSION
            );
            wp_enqueue_script('vcv:settings:script');
            wp_enqueue_style('vcv:settings:style');
        }
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
