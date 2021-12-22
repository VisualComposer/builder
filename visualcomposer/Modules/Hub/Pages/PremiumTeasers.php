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
use VisualComposer\Helpers\Access\CurrentUser;

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
                'Enable a maintenance mode for site visitors with Visual Composer Premium when performing updates, changes in design layouts, or code releases.',
                'visualcomposer'
            ),
            'premiumUrl' => str_replace('{medium}', 'maintenancemode-vcdashboard', $utmTemplate),
            'premiumActionBundle' => 'maintenanceMode',
            'capability' => 'manage_options',
        ];
        $this->dashboardSections[] = [
            'slug' => 'vcv-custom-site-popups',
            'name' => __('Popup Builder', 'visualcomposer'),
            'subTitle' => __('Popup Settings', 'visualcomposer'),
            'premiumTitle' => __('POPUP BUILDER IS A PREMIUM FEATURE', 'visualcomposer'),
            'premiumDescription' => __(
                'Specify site-wide popups for specific events (First Page Load, Every Page Load, or Exit Intent) with Popup Builder addon available in Premium.',
                'visualcomposer'
            ),
            'premiumUrl' => str_replace('{medium}', 'customsitepopups-vcdashboard', $utmTemplate),
            'premiumActionBundle' => 'popupBuilder',
            'iconClass' => 'vcv-ui-icon-dashboard-popup-builder',
            'parent' => 'vcv-custom-site-popups',
            'capabilityPart' => 'dashboard_addon_popup_builder',
            'hideInWpMenu' => false,
        ];
        $this->dashboardSections[] = [
            'slug' => 'vcv_templates',
            'premiumTitle' => __('GLOBAL TEMPLATES IS A PREMIUM FEATURE', 'visualcomposer'),
            'premiumDescription' => __(
                'Create global templates that will automatically update across all site upon changes. Save time on editing with the Global Templates addon available in Premium.',
                'visualcomposer'
            ),
            'premiumUrl' => str_replace('{medium}', 'templates-vcdashboard', $utmTemplate),
            'premiumActionBundle' => 'globalTemplate',
            'name' => __('Global Templates', 'visualcomposer'),
            'subTitle' => __('Templates', 'visualcomposer'),
            'parent' => 'vcv_templates',
            'iconClass' => 'vcv-ui-icon-dashboard-template',
            'capabilityPart' => 'dashboard_addon_global_templates',
            'hideInWpMenu' => false,
        ];
        $this->dashboardSections[] = [
            'slug' => 'vcv-headers-footers',
            'name' => __('Theme Builder', 'visualcomposer'),
            'subTitle' => __('Theme Builder Settings', 'visualcomposer'),
            'parent' => 'vcv-headers-footers',
            'premiumTitle' => __('THEME BUILDER IS A PREMIUM FEATURE', 'visualcomposer'),
            'premiumDescription' => __(
                'Replace the theme default header and footer with custom header and footer templates using Visual Composer Header and Footer Builder.',
                'visualcomposer'
            ),
            'premiumUrl' => str_replace('{medium}', 'headersfooters-vcdashboard', $utmTemplate),
            'premiumActionBundle' => 'themeEditor',
            'iconClass' => 'vcv-ui-icon-dashboard-theme-builder',
            'capabilityPart' => 'dashboard_addon_theme_builder',
            'hideInWpMenu' => false,
        ];
        $this->dashboardSections[] = [
            'slug' => 'vcv_headers',
            'premiumTitle' => __('HEADER BUILDER IS A PREMIUM FEATURE', 'visualcomposer'),
            'premiumDescription' => __(
                'Create custom header templates or pick a ready-to-use template with the Header Builder available in Premium.',
                'visualcomposer'
            ),
            'premiumUrl' => str_replace('{medium}', 'headers-vcdashboard', $utmTemplate),
            'premiumActionBundle' => 'themeEditor',
            'name' => __('Headers', 'visualcomposer'),
            'parent' => 'vcv-headers-footers',
            'capabilityPart' => 'dashboard_addon_theme_builder',
        ];
        $this->dashboardSections[] = [
            'slug' => 'vcv_footers',
            'premiumTitle' => __('FOOTER BUILDER IS A PREMIUM FEATURE', 'visualcomposer'),
            'premiumDescription' => __(
                'Build a custom website footer or pick a ready-to-use template with the Footer Builder available in Premium.',
                'visualcomposer'
            ),
            'premiumUrl' => str_replace('{medium}', 'footers-vcdashboard', $utmTemplate),
            'premiumActionBundle' => 'themeEditor',
            'name' => __('Footers', 'visualcomposer'),
            'parent' => 'vcv-headers-footers',
            'capabilityPart' => 'dashboard_addon_theme_builder',
        ];
        $this->dashboardSections[] = [
            'slug' => 'vcv_sidebars',
            'premiumTitle' => __('SIDEBAR BUILDER IS A PREMIUM FEATURE', 'visualcomposer'),
            'premiumDescription' => __(
                'Create a custom sidebar or pick a ready-made template with the Sidebar Builder available in Premium.',
                'visualcomposer'
            ),
            'premiumUrl' => str_replace('{medium}', 'sidebars-vcdashboard', $utmTemplate),
            'premiumActionBundle' => 'themeEditor',
            'name' => __('Sidebars', 'visualcomposer'),
            'parent' => 'vcv-headers-footers',
            'capabilityPart' => 'dashboard_addon_theme_builder',
        ];
        $this->dashboardSections[] = [
            'slug' => 'vcv_layouts',
            'premiumTitle' => __('LAYOUT EDITOR IS A PREMIUM FEATURE', 'visualcomposer'),
            'premiumDescription' => __(
                'Design custom archive pages for your blog, portfolio, and more. Define templates for post archive, categories, tags, author, and search results with the Archive Editor available in Premium.',
                'visualcomposer'
            ),
            'premiumUrl' => str_replace('{medium}', 'layouts-vcdashboard', $utmTemplate),
            'premiumActionBundle' => 'themeBuilder',
            'name' => __('Layouts', 'visualcomposer'),
            'parent' => 'vcv-headers-footers',
            'capabilityPart' => 'dashboard_addon_theme_builder',
        ];
        $this->dashboardSections[] = [
            'slug' => 'vcv-font-manager',
            'name' => __('Font Manager', 'visualcomposer'),
            'subTitle' => __('Font Manager', 'visualcomposer'),
            'premiumTitle' => __('FONT MANAGER IS A PREMIUM FEATURE', 'visualcomposer'),
            'premiumDescription' => __(
                'Control the typography and other font styling of your site, including links, paragraphs, headings.',
                'visualcomposer'
            ),
            'premiumUrl' => str_replace('{medium}', 'fontmanager-vcdashboard', $utmTemplate),
            'premiumActionBundle' => 'fontManager',
            'iconClass' => 'vcv-ui-icon-dashboard-a-letter',
            'parent' => 'vcv-font-manager',
            'capabilityPart' => 'dashboard_addon_font_manager',
            'hideInWpMenu' => false,
        ];
        $this->dashboardSections[] = [
            'slug' => 'vcv-import',
            'name' => __('Import', 'visualcomposer'),
            'subTitle' => '',
            'parent' => 'vcv-import',
            'premiumTitle' => __('TEMPLATE IMPORT AND EXPORT IS A PREMIUM FEATURE', 'visualcomposer'),
            'premiumDescription' => __(
                'Migrate your templates from site to site with the Export/Import addon available in Premium.',
                'visualcomposer'
            ),
            'premiumUrl' => str_replace('{medium}', 'templatesimport-vcdashboard', $utmTemplate),
            'iconClass' => 'vcv-ui-icon-dashboard-import',
            'premiumActionBundle' => 'exportImport',
            'capabilityPart' => 'dashboard_addon_export_import',
        ];
        $this->dashboardSections[] = [
            'slug' => 'vcv_popups',
            'parent' => 'vcv-custom-site-popups',
            'name' => __('Popups', 'visualcomposer'),
            'premiumTitle' => __('POPUP BUILDER IS A PREMIUM FEATURE', 'visualcomposer'),
            'premiumDescription' => __(
                'Build custom popups with the Popup Builder addon available in Premium.',
                'visualcomposer'
            ),
            'premiumUrl' => str_replace('{medium}', 'customsitepopups-vcdashboard', $utmTemplate),
            'premiumActionBundle' => 'popupBuilder',
            'capabilityPart' => 'dashboard_addon_popup_builder',
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

        // Call this function after init for multisite WordPress instances
        $this->wpAddAction('init', 'checkTeaserVisibility');
    }

    /**
     * If user cannot download addons then no need to show teaser
     */
    protected function checkTeaserVisibility()
    {
        $currentUserAccess = vchelper('AccessCurrentUser');
        $isHubAddonsEnabled = $currentUserAccess->part('hub')->can('addons')->get();
        if ($isHubAddonsEnabled) {
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
                    $currentUserAccess = vchelper('AccessCurrentUser');
                    foreach ($this->dashboardSections as $section) {
                        // Addon installed, skip teaser
                        if (array_key_exists($section['premiumActionBundle'], $addons)) {
                            continue;
                        }
                        if (
                            !$dataHelper->arraySearch($allTabs, 'slug', $section['slug'])
                            && $this->hasAccess(
                                $section,
                                $currentUserAccess
                            )
                        ) {
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
    }

    protected function outputDashboardMenu()
    {
        global $submenu;
        if (isset($submenu['vcv-settings'])) {
            $columnsData = array_column($submenu['vcv-settings'], 2);
            $currentUserAccess = vchelper('AccessCurrentUser');
            $addons = vchelper('HubAddons')->getAddons();

            foreach ($this->dashboardSections as $teaser) {
                if (in_array($teaser['slug'], $columnsData, true)) {
                    continue;
                }
                // Addon installed, skip teaser
                if (array_key_exists($teaser['premiumActionBundle'], $addons)) {
                    continue;
                }
                $hasAccess = $this->hasAccess($teaser, $currentUserAccess);

                if (!$hasAccess) {
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
                // After add_submenu_page called last index of $submenu['vcv-settings'] will be recently added item
                // So we can adjust it to add extra-class to hide
                $extraClass = 'vcv-submenu--' . vchelper('Str')->slugify($teaser['slug']);
                $extraClass .= $teaser['isDashboardPage'] ? ' vcv-submenu-dashboard-page' : '';
                if (isset($teaser['hideInWpMenu']) && $teaser['hideInWpMenu']) {
                    $extraClass .= ' vcv-ui-state--hidden';
                }
                $submenu['vcv-settings'][1][4] = $extraClass;
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

    /**
     * @param array $teaser
     * @param \VisualComposer\Helpers\Access\CurrentUser $currentUserAccess
     *
     * @return array
     */
    protected function hasAccess(array $teaser, CurrentUser $currentUserAccess)
    {
        $capability = 'read';
        if (isset($teaser['capability'])) {
            $capability = $teaser['capability'];
        }

        if (isset($teaser['capabilityPart']) && vcvenv('VCV_ADDON_ROLE_MANAGER_ENABLED')) {
            $part = $teaser['capabilityPart'];
        }
        if (!empty($part)) {
            $hasAccess = $currentUserAccess->part($part)->checkState(true)->get();
        } else {
            // Fallback to default logic
            $hasAccess = $currentUserAccess->wpAll($capability)->get();
        }

        return $hasAccess;
    }
}
