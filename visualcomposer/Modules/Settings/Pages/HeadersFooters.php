<?php

namespace VisualComposer\Modules\Settings\Pages;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Status;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Modules\Settings\Traits\Page;
use VisualComposer\Modules\Settings\Traits\SubMenu;
use VisualComposer\Helpers\Traits\EventsFilters;

class HeadersFooters extends Container implements Module
{
    use Page;
    use SubMenu;
    use WpFiltersActions;
    use EventsFilters;

    /**
     * @var string
     */
    protected $slug = 'vcv-headers-footers';

    /*
     * @var string
     */
    protected $templatePath = 'settings/pages/index';

    public function __construct()
    {
        $this->wpAddAction(
            'admin_menu',
            'addPage'
        );

        $this->wpAddFilter('submenu_file', 'subMenuHighlight');

        $this->wpAddAction(
            'in_admin_header',
            'addCss'
        );

        $this->addFilter('vcv:settings:tabs', 'addSettingsTab', 2);
    }

    protected function beforeRender()
    {
        $urlHelper = vchelper('Url');
        wp_register_style(
            'vcv:wpUpdate:style',
            $urlHelper->assetUrl('dist/wpUpdate.bundle.css'),
            [],
            VCV_VERSION
        );
        wp_enqueue_style('vcv:wpUpdate:style');

        wp_register_script(
            'vcv:wpVcSettings:script',
            $urlHelper->assetUrl('dist/wpVcSettings.bundle.js'),
            [],
            VCV_VERSION
        );
        wp_enqueue_script('vcv:wpVcSettings:script');
    }

    /**
     * @param $tabs
     *
     * @return mixed
     */
    protected function addSettingsTab($tabs)
    {
        $tabs['vcv-headers-footers'] = [
            'name' => __('Headers and Footers', 'vcwb'),
        ];

        return $tabs;
    }

    protected function subMenuHighlight($submenuFile)
    {
        $screen = get_current_screen();
        if (strpos($screen->id, $this->slug)) {
            $submenuFile = 'vcv-settings';
        }

        return $submenuFile;
    }

    /**
     * @throws \Exception
     */
    protected function addPage()
    {
        $page = [
            'slug' => $this->getSlug(),
            'title' => __('Headers and Footers', 'vcwb'),
            'layout' => 'settings-standalone-with-tabs',
            'showTab' => false,
            'controller' => $this,
        ];
        $this->addSubmenuPage($page);
    }

    protected function addCss()
    {
        evcview('settings/partials/headers-footers-settings');
    }
}
