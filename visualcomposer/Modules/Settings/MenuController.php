<?php

namespace VisualComposer\Modules\Settings;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Url;
use VisualComposer\Modules\Settings\Pages\Settings;
use VisualComposer\Helpers\Settings\TabsRegistry;

/**
 * Class MenuController.
 */
class MenuController extends Container implements Module
{
    use WpFiltersActions;

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Settings\MenuController::addMenuPage */
        $this->wpAddAction(
            'admin_menu',
            'addMenuPage',
            0
        );

        /** @see \VisualComposer\Modules\Settings\MenuController::removeFirstMenuItem */
        $this->wpAddAction(
            'admin_menu',
            'removeFirstMenuItem',
            100
        );

        /** @see \VisualComposer\Modules\Settings\MenuController::addMenuPage */
        $this->wpAddAction(
            'network_admin_menu',
            'addMenuPage'
        );

        $this->wpAddAction('admin_head', 'addMenuCss');

        $this->wpAddAction('admin_menu', 'arrangeSubmenuItems', 1000);

        $this->wpAddAction('after_setup_theme', 'addMenuSectionToDashboard', 100);
    }

    /**
     * Get main page slug.
     * This determines what page is opened when user clicks 'Visual Composer' in settings menu.
     * If user has administrator privileges, 'General' page is opened, if not, 'About' is opened.
     *
     * Register main menu page
     *
     * @param \VisualComposer\Helpers\Url $urlHelper
     *
     * @param \VisualComposer\Modules\Settings\Pages\Settings $settingsController
     */
    protected function addMenuPage(Url $urlHelper, Settings $settingsController)
    {
        if (!is_network_admin()) {
            $title = __('Visual Composer', 'visualcomposer');
            $iconUrl = $urlHelper->assetUrl('images/logo/20x14.png');

            add_menu_page($title, $title, 'edit_posts', $settingsController->getMainPageSlug(), null, $iconUrl, 76);
        }
    }

    /**
     * Remove first menu item if user has no access for settings
     *
     * @param \VisualComposer\Modules\Settings\Pages\Settings $settingsController
     *
     * @throws \Exception
     */
    protected function removeFirstMenuItem(Settings $settingsController)
    {
        $currentUserAccess = vchelper('AccessCurrentUser');
        $hasAccess = $currentUserAccess->wpAll('edit_pages')->get();
        $mainPageSlug = $settingsController->getMainPageSlug();

        if (!$hasAccess && !is_network_admin()) {
            remove_submenu_page($mainPageSlug, $mainPageSlug);
        }
    }

    protected function addMenuCss()
    {
        $outputHelper = vchelper('Output');
        $css = <<<CSS
    <style>
        #toplevel_page_vcv-settings .wp-submenu .vcv-ui-state--hidden,
        #toplevel_page_vcv-getting-started .wp-submenu .vcv-ui-state--hidden {
            display: none;
        }
    </style>
CSS;
        $outputHelper->printNotEscaped($css);
    }

    /**
     * Re-range settings menu items in dashboard according to menu tabs tree structure.
     */
    protected function arrangeSubmenuItems(TabsRegistry $tabsRegistryHelper)
    {
        $globalsHelper = vchelper('Globals');
        $submenuCopy = $globalsHelper->get('submenu');

        if (empty($submenuCopy['vcv-settings'])) {
            return;
        }

        $menuColumn = array_column($submenuCopy['vcv-settings'], 2);
        $topLevelMenu = [];
        foreach ($tabsRegistryHelper->menuTree as $slug => $item) {
            if (is_array($item)) {
                $index = array_search($slug, $menuColumn);
            } else {
                $index = array_search($item, $menuColumn);
            }

            if ($index !== false) {
                $topLevelMenu[] = $submenuCopy['vcv-settings'][ $index ];
                unset($submenuCopy['vcv-settings'][ $index ]);
            }
        }

        $submenuCopy['vcv-settings'] = array_merge($topLevelMenu, $submenuCopy['vcv-settings']);
        $globalsHelper->set('submenu', $submenuCopy);
    }

    /**
     * We initialize menu section for every WP installation.
     *
     * @return void
     */
    protected function addMenuSectionToDashboard()
    {
        // @codingStandardsIgnoreLine
        global $wp_version;

        // @codingStandardsIgnoreLine
        $isVersionCorrespond = version_compare($wp_version, '5.9-alpha', '>=');
        if ($isVersionCorrespond) {
            add_theme_support('menus');
            add_theme_support('widgets');
        }
    }
}
