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
            'addPage',
            20
        );

        $this->addEvent(
            'vcv:settings:save',
            'addPage'
        );

        $this->wpAddFilter('submenu_file', 'subMenuHighlight');
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
            'title' => __('CSS & JavaScript', 'visualcomposer'),
            'layout' => 'dashboard-tab-content-standalone',
            'capability' => 'manage_options',
            'capabilityPart' => 'dashboard_settings_custom_html',
            'iconClass' => 'vcv-ui-icon-dashboard-css',
            'isDashboardPage' => true,
            'hideInWpMenu' => false,
        ];
        $this->addSubmenuPage($page, false);
    }
}
