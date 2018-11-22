<?php

namespace VisualComposer\Modules\Settings;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Access\CurrentUser;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Url;

/**
 * Class MenuController.
 */
class MenuController extends Container implements Module
{
    use WpFiltersActions;

    /**
     * @var null
     */
    protected $pages = null;

    /**
     * @var string
     */
    protected $optionGroup = 'vcv-settings';

    /**
     * @var string
     */
    protected $pageSlug = 'vcv-settings';

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
     * @param \VisualComposer\Helpers\Access\CurrentUser $currentUserAccess
     *
     * @throws \Exception
     */
    protected function addMenuPage(Url $urlHelper, CurrentUser $currentUserAccess)
    {
        if (!is_network_admin()) {
            /** @var bool $hasAccess - User must have edit pages capability to see settings, otherwise only about page available */
            $hasAccess = $currentUserAccess->wpAll('edit_pages')->part('settings')->can('vcv-settings')->get();

            $mainPageSlug = $hasAccess ? 'vcv-settings' : 'vcv-about';
            $title = __('Visual Composer ', 'vcwb');
            $iconUrl = $urlHelper->assetUrl('images/logo/20x14.png');

            add_menu_page($title, $title, 'edit_posts', $mainPageSlug, null, $iconUrl, 76);
        }
    }
}
