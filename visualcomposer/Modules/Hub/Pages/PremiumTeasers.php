<?php

namespace VisualComposer\Modules\Hub\Pages;

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

class PremiumTeasers extends Container implements Module
{
    use Page;
    use SubMenu;
    use WpFiltersActions;
    use EventsFilters;

    /**
     * PremiumTeasers constructor.
     */
    public function __construct()
    {
        $this->wpAddAction(
            'admin_menu',
            'outputDashboardMenu',
            60
        );
    }

    protected function outputDashboardMenu()
    {
        global $submenu;
        if (is_array($submenu['vcv-settings'])) {
            $utmTemplate = vchelper('Utm')->get('editor-hub-popup-teaser');
            $teasers = [
                [
                    __('Headers and Footers', 'visualcomposer'),
                    'vcv-headers-footers',
                    __('HEADERS AND FOOTERS ARE A PREMIUM FEATURE', 'visualcomposer'),
                    __(
                        'Visual Composer Premium allows replacing the theme default header and footer with your header and footer templates created with Visual Composer.',
                        'visualcomposer'
                    ),
                    str_replace('{medium}', 'headersfooters-vcdashboard', $utmTemplate),
                    'themeEditor',
                ],
                [
                    __('Theme Templates', 'visualcomposer'),
                    'vcv-custom-page-templates',
                    __('THEME TEMPLATES ARE A PREMIUM FEATURE', 'visualcomposer'),
                    __(
                        'Visual Composer Premium allows replacing the theme default theme templates like 404 page, search page, author page, post archive with your templates created with Visual Composer.',
                        'visualcomposer'
                    ),
                    str_replace('{medium}', 'custompagetemplates-vcdashboard', $utmTemplate),
                    'themeBuilder',
                ],
                [
                    __('Maintenance Mode', 'visualcomposer'),
                    'vcv-maintenance-mode',
                    __('MAINTENANCE MODE IS A PREMIUM FEATURE', 'visualcomposer'),
                    __(
                        'Visual Composer Premium allows enabling maintenance mode and selecting the page that will be displayed to the website visitors. Users with access to the admin panel will still be able to preview and edit the website.',
                        'visualcomposer'
                    ),
                    str_replace('{medium}', 'maintenancemode-vcdashboard', $utmTemplate),
                    'maintenanceMode',
                ],
                [
                    __('Popup Settings', 'visualcomposer'),
                    'vcv-custom-site-popups',
                    __('POPUP BUILDER IS A PREMIUM FEATURE', 'visualcomposer'),
                    __(
                        'Visual Composer Premium allows specifying site-wide popups for specific events like First Page Load, Every Page Load, or Exit Intent.',
                        'visualcomposer'
                    ),
                    str_replace('{medium}', 'customsitepopups-vcdashboard', $utmTemplate),
                    'popupBuilder',
                ],
            ];
            $columnsData = array_column($submenu['vcv-settings'], 2);
            foreach ($teasers as $index => $teaser) {
                if (in_array($teaser[1], $columnsData, true)) {
                    continue;
                }

                $offset = 1;
                array_splice($submenu['vcv-settings'], $offset, 0, [$teaser]);
                $this->slug = $teaser[1];
                $this->templatePath = 'settings/pages/index';

                $page = [
                    'slug' => $teaser[1],
                    'title' => $teaser[0],
                    'layout' => 'dashboard-tab-content-standalone',
                    'capability' => 'manage_options',
                    'isDashboardPage' => true,
                    'isPremiumTeaser' => true,
                    'hideInWpMenu' => true,
                    'hideTitle' => true,
                    'premiumTitle' => $teaser[2],
                    'premiumDescription' => $teaser[3],
                    'premiumUrl' => $teaser[4],
                    'premiumActionBundle' => $teaser[5],
                ];
                $this->addSubmenuPage($page);
            }
        }
    }

    protected function beforeRender()
    {
        evcview('settings/partials/premium-teaser-css');
    }
}
