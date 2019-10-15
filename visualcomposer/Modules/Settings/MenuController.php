<?php

namespace VisualComposer\Modules\Settings;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Settings\TabsRegistry;
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

        /** @see \VisualComposer\Modules\Settings\MenuController::addMenuPage */
        $this->wpAddAction(
            'network_admin_menu',
            'addMenuPage'
        );

        /** @see \VisualComposer\Modules\Settings\MenuController::addGeneralTab */
        $this->wpAddAction('admin_menu', 'addGeneralTab', -1);
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

    protected function addGeneralTab(TabsRegistry $tabsRegistry)
    {
        $tabsRegistry->set('vcv-settings', ['name' => __('General', 'vcwb')]);
    }
}
