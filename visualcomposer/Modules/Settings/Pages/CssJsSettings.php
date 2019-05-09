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

class CssJsSettings extends Container implements Module
{
    use Page;
    use SubMenu;
    use WpFiltersActions;
    use EventsFilters;

    /**
     * @var string
     */
    protected $slug = 'vcv-global-css-js';

    /*
     * @var string
     */
    protected $templatePath = 'settings/pages/index';

    public function __construct(Status $statusHelper, Options $optionsHelper)
    {
        if (!vcvenv('VCV_ENV_FT_GLOBAL_CSS_JS_SETTINGS')) {
            return;
        }

        $this->wpAddAction(
            'admin_menu',
            'addPage'
        );

        $this->wpAddFilter('submenu_file', 'subMenuHighlight');

        $this->wpAddAction(
            'in_admin_header',
            'addCss'
        );

        $this->addFilter('vcv:settings:tabs', 'addSettingsTab', 3);
    }

    /**
     * @param $tabs
     *
     * @return mixed
     */
    protected function addSettingsTab($tabs)
    {
        $tabs['vcv-global-css-js'] = [
            'name' => __('CSS, HTML & JavaScript', 'vcwb'),
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
     *
     */
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

        wp_register_script(
            'vcv:wpVcSettings:script',
            $urlHelper->to('public/dist/wpVcSettings.bundle.js'),
            ['vcv:assets:vendor:script'],
            VCV_VERSION
        );
        wp_enqueue_script('vcv:wpVcSettings:script');
    }

    /**
     * @throws \Exception
     */
    protected function addPage()
    {
        $page = [
            'slug' => $this->getSlug(),
            'title' => __('CSS, HTML & JavaScript', 'vcwb'),
            'layout' => 'settings-standalone-with-tabs',
            'showTab' => false,
            'controller' => $this,
        ];
        $this->addSubmenuPage($page);
    }

    protected function addCss()
    {
        evcview('settings/partials/global-css-js-settings-css');
    }
}
