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
use VisualComposer\Modules\Settings\Traits\SubMenu;

class PremiumTeasers extends Container implements Module
{
    use SubMenu;
    use WpFiltersActions;
    use EventsFilters;

    protected $dashboardSections = [];

    /**
     * PremiumTeasers constructor.
     */
    public function __construct()
    {
        $utmTemplate = vchelper('Utm')->get('editor-hub-popup-teaser');
        $this->dashboardSections[] = [
            'slug' => 'vcv-maintenance-mode',
            'name' => __('Maintenance Mode', 'visualcomposer'),
            'parent' => 'vcv-settings',
            'subTitle' => '',
            'premiumTitle' => __('MAINTENANCE MODE IS A PREMIUM FEATURE', 'visualcomposer'),
            'premiumDescription' => __(
                'Visual Composer Premium allows enabling maintenance mode and selecting the page that will be displayed to the website visitors. Users with access to the admin panel will still be able to preview and edit the website.',
                'visualcomposer'
            ),
            'premiumUrl' => str_replace('{medium}', 'maintenancemode-vcdashboard', $utmTemplate),
            'premiumActionBundle' => 'maintenanceMode',
            'position' => -9,
        ];
        $this->dashboardSections[] = [
            'slug' => 'vcv-custom-site-popups',
            'name' => __('Popup Builder', 'visualcomposer'),
            'subTitle' => __('Popup Settings', 'visualcomposer'),
            'premiumTitle' => __('POPUP BUILDER IS A PREMIUM FEATURE', 'visualcomposer'),
            'premiumDescription' => __(
                'Visual Composer Premium allows specifying site-wide popups for specific events like First Page Load, Every Page Load, or Exit Intent.',
                'visualcomposer'
            ),
            'premiumUrl' => str_replace('{medium}', 'customsitepopups-vcdashboard', $utmTemplate),
            'premiumActionBundle' => 'popupBuilder',
            'iconClass' => 'vcv-ui-icon-dashboard-popup-builder',
            'parent' => 'vcv-custom-site-popups',
            'position' => -1,
            'hideInWpMenu' => false,
        ];
        $this->dashboardSections[] = [
            'slug' => 'vcv_templates',
            'premiumTitle' => __('GLOBAL TEMPLATES ARE A PREMIUM FEATURE', 'visualcomposer'),
            'premiumDescription' => __(
                'Visual Composer Premium allows creating global templates and editing them from one place. Save time on editing multiple pages of your site with the Global Templates addon.',
                'visualcomposer'
            ),
            'premiumUrl' => str_replace('{medium}', 'templates-vcdashboard', $utmTemplate),
            'premiumActionBundle' => 'globalTemplate',
            'position' => -3,
            'name' => __('Global Templates', 'visualcomposer'),
            'subTitle' => __('Templates', 'visualcomposer'),
            'parent' => 'vcv_templates',
            'iconClass' => 'vcv-ui-icon-dashboard-template',
            'hideInWpMenu' => false,
        ];
        $this->dashboardSections[] = [
            'slug' => 'vcv-headers-footers',
            'name' => __('Theme Builder', 'visualcomposer'),
            'subTitle' => __('Header and Footer Settings', 'visualcomposer'),
            'parent' => 'vcv-headers-footers',
            'premiumTitle' => __('HEADERS AND FOOTERS ARE A PREMIUM FEATURE', 'visualcomposer'),
            'premiumDescription' => __(
                'Visual Composer Premium allows replacing the theme default header and footer with your header and footer templates created with Visual Composer.',
                'visualcomposer'
            ),
            'premiumUrl' => str_replace('{medium}', 'headersfooters-vcdashboard', $utmTemplate),
            'premiumActionBundle' => 'themeEditor',
            'iconClass' => 'vcv-ui-icon-dashboard-theme-builder',
            'position' => -9,
            'hideInWpMenu' => false,
        ];

        $this->dashboardSections[] = [
            'slug' => 'vcv-custom-page-templates',
            'name' => __('Layout Settings', 'visualcomposer'),
            'premiumTitle' => __('THEME TEMPLATES ARE A PREMIUM FEATURE', 'visualcomposer'),
            'premiumDescription' => __(
                'Visual Composer Premium allows replacing the theme default theme templates like 404 page, search page, author page, post archive with your templates created with Visual Composer.',
                'visualcomposer'
            ),
            'premiumUrl' => str_replace('{medium}', 'custompagetemplates-vcdashboard', $utmTemplate),
            'premiumActionBundle' => 'themeBuilder',
            'position' => -8,
            'parent' => 'vcv-headers-footers',
        ];
        $this->dashboardSections[] = [
            'slug' => 'vcv_headers',
            'premiumTitle' => __('CUSTOM HEADERS ARE A PREMIUM FEATURE', 'visualcomposer'),
            'premiumDescription' => __(
                'Visual Composer Premium allows creating header templates with a unique design or download ready-to-use templates from the Visual Composer Hub.',
                'visualcomposer'
            ),
            'premiumUrl' => str_replace('{medium}', 'headers-vcdashboard', $utmTemplate),
            'premiumActionBundle' => 'themeEditor',
            'name' => __('Headers', 'visualcomposer'),
            'parent' => 'vcv-headers-footers',
            'position' => -7,
        ];
        $this->dashboardSections[] = [
            'slug' => 'vcv_footers',
            'premiumTitle' => __('CUSTOM FOOTERS ARE A PREMIUM FEATURE', 'visualcomposer'),
            'premiumDescription' => __(
                'Visual Composer Premium allows building your own website footer with the Footer editor or download ready-to-use templates from the Visual Composer Hub.',
                'visualcomposer'
            ),
            'premiumUrl' => str_replace('{medium}', 'footers-vcdashboard', $utmTemplate),
            'premiumActionBundle' => 'themeEditor',
            'name' => __('Footers', 'visualcomposer'),
            'parent' => 'vcv-headers-footers',
            'position' => -6,
        ];
        $this->dashboardSections[] = [
            'slug' => 'vcv_sidebars',
            'premiumTitle' => __('CUSTOM SIDEBARS ARE A PREMIUM FEATURE', 'visualcomposer'),
            'premiumDescription' => __(
                'Visual Composer Premium allows creating a custom WordPress sidebar with the Visual Composer Editor or download ready-made templates from the Hub.',
                'visualcomposer'
            ),
            'premiumUrl' => str_replace('{medium}', 'sidebars-vcdashboard', $utmTemplate),
            'premiumActionBundle' => 'themeEditor',
            'name' => __('Sidebars', 'visualcomposer'),
            'parent' => 'vcv-headers-footers',
            'position' => -5,
        ];
        $this->dashboardSections[] = [
            'slug' => 'vcv_archives',
            'premiumTitle' => __('CUSTOM ARCHIVES ARE A PREMIUM FEATURE', 'visualcomposer'),
            'premiumDescription' => __(
                'Visual Composer Premium allows designing custom archive pages for your blogs, news, portfolios, and more. Define templates for post archive, categories, tags, author, and search results.',
                'visualcomposer'
            ),
            'premiumUrl' => str_replace('{medium}', 'archives-vcdashboard', $utmTemplate),
            'premiumActionBundle' => 'themeBuilder',
            'name' => __('Archives', 'visualcomposer'),
            'parent' => 'vcv-headers-footers',
            'position' => 15,
        ];
        $this->dashboardSections[] = [
            'slug' => 'vcv-import',
            'name' => __('Import', 'visualcomposer'),
            'subTitle' => '',
            'parent' => 'vcv_templates',
            'premiumTitle' => __('TEMPLATE IMPORT IS A PREMIUM FEATURE', 'visualcomposer'),
            'premiumDescription' => __(
                'Visual Composer Premium allows migrating your templates from site to site with the Export/Import addon.',
                'visualcomposer'
            ),
            'premiumUrl' => str_replace('{medium}', 'templatesimport-vcdashboard', $utmTemplate),
            'premiumActionBundle' => 'exportImport',
            'position' => -2,
        ];
        $this->dashboardSections[] = [
            'slug' => 'vcv_popups',
            'parent' => 'vcv-custom-site-popups',
            'name' => __('Popups', 'visualcomposer'),
            'premiumTitle' => __('POPUP BUILDER IS A PREMIUM FEATURE', 'visualcomposer'),
            'premiumDescription' => __(
                'Visual Composer Premium allows building custom popups with the Popup Builder addon.',
                'visualcomposer'
            ),
            'premiumUrl' => str_replace('{medium}', 'customsitepopups-vcdashboard', $utmTemplate),
            'premiumActionBundle' => 'popupBuilder',
            'position' => -1,
        ];

        // Append defaults for all sections
        $this->dashboardSections = array_map(
            function ($section) {
                $section = array_merge(
                    [
                        'hideInWpMenu' => true,
                        'subTitle' => '',
                        'dashboardName' => '',
                        'capability' => 'read',
                        'layout' => 'dashboard-tab-content-standalone',
                        'isDashboardPage' => true,
                        'hideTitle' => true,
                        'iconClass' => '',
                        'children' => [],
                    ],
                    $section
                );

                return $section;
            },
            $this->dashboardSections
        );

        $this->wpAddAction(
            'admin_menu',
            'outputDashboardMenu',
            60
        );
        $this->addFilter(
            'vcv:helper:tabsRegistry:all',
            function ($allTabs, $payload) {
                $addons = vchelper('HubAddons')->getAddons();
                $dataHelper = vchelper('Data');
                $haveUpdates = false;
                foreach ($this->dashboardSections as $section) {
                    // Addon installed, skip teaser
                    if (array_key_exists($section['premiumActionBundle'], $addons)) {
                        continue;
                    }
                    if (!$dataHelper->arraySearch($allTabs, 'slug', $section['slug'])) {
                        $section['callback'] = function () use ($section) {
                            echo vcview(
                                'settings/layouts/dashboard-premium-teaser',
                                ['page' => $section, 'slug' => $section['slug']]
                            );
                        };
                        $allTabs[] = $section;
                        $haveUpdates = true;
                    }
                }

                // sort allTabs properly depending on position
                if ($haveUpdates) {
                    $allTabs = $this->sortAllTabs($allTabs, $dataHelper);
                }

                return $allTabs;
            }
        );
    }

    protected function outputDashboardMenu()
    {
        global $submenu;
        if (isset($submenu['vcv-settings'])) {
            $columnsData = array_column($submenu['vcv-settings'], 2);
            foreach ($this->dashboardSections as $teaser) {
                if (in_array($teaser['slug'], $columnsData, true)) {
                    continue;
                }

                add_submenu_page(
                    'vcv-settings',
                    $teaser['name'],
                    $teaser['name'],
                    $teaser['capability'],
                    $teaser['slug'],
                    function () use ($teaser) {
                        $teaser['layout'] = 'dashboard-main-layout';
                        echo $this->call('renderPage', ['page' => $teaser]);
                    },
                    1
                );
                if (isset($teaser['hideInWpMenu']) && $teaser['hideInWpMenu']) {
                    $submenu['vcv-settings'][1][4] = 'vcv-ui-state--hidden';
                }
            }
        }
    }

    /**
     * Render teaser content
     */
    protected function render($page)
    {
        vcevent('vcv:settings:page:' . $page['slug'] . ':beforeRender', $page);
        $args = [
            'slug' => $page['slug'],
            'path' => 'settings/pages/index',
            'page' => $page,
        ];

        return vcview('settings/pages/index', $args);
    }

    /**
     * @param $allTabs
     * @param mixed $dataHelper
     *
     * @return mixed
     */
    protected function sortAllTabs($allTabs, $dataHelper)
    {
        $getPos = function ($item) use ($allTabs, $dataHelper) {
            if (isset($item['position'])) {
                $itemPosition = $item['position'];
            } else {
                // Get current position in the list for comparator (for native items it starts from 1...) (just array index)
                $itemPosition = $dataHelper->arraySearch(
                    $allTabs,
                    'slug',
                    $item['slug'],
                    true
                );
            }

            return $itemPosition;
        };

        usort(
            $allTabs,
            function ($a, $b) use ($getPos) {
                $aPos = $getPos($a);
                $bPos = $getPos($b);

                return $aPos - $bPos;
            }
        );

        return $allTabs;
    }
}
