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
            'removeFirstMenuItem'
        );

        /** @see \VisualComposer\Modules\Settings\MenuController::addMenuPage */
        $this->wpAddAction(
            'network_admin_menu',
            'addMenuPage'
        );

        $this->wpAddAction('admin_head', 'addMenuCss');
    }

    /**
     * Get main page slug.
     * This determines what page is opened when user clicks 'Visual Composer' in settings menu.
     * If user user has administrator privileges, 'General' page is opened, if not, 'About' is opened.
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
        $hasAccess = $currentUserAccess->wpAll('edit_pages')->part('settings')->can('vcv-settings')->get();
        $mainPageSlug = $settingsController->getMainPageSlug();

        if (!$hasAccess && !is_network_admin()) {
            remove_submenu_page($mainPageSlug, $mainPageSlug);
        }
    }

    protected function addMenuCss()
    {
        echo <<<CSS
    <style>
        #toplevel_page_vcv-settings .wp-submenu .vcv-ui-state--hidden {
            display: none;
        }
    </style>
CSS;
    }
}
