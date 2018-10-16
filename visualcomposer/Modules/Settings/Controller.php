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
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Url;

/**
 * Class Controller.
 */
class Controller extends Container implements Module
{
    use WpFiltersActions;
    use EventsFilters;

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
        if (!vcvenv('VCV_FT_ACTIVATION_REDESIGN')) {
            /** @see \VisualComposer\Modules\Settings\Controller::initAdmin */
            $this->wpAddAction(
                'admin_init',
                'initAdmin'
            );
        }

        /** @see \VisualComposer\Modules\Settings\Controller::addMenuPage */
        $this->wpAddAction(
            'admin_menu',
            'addMenuPage'
        );

        /** @see \VisualComposer\Modules\Settings\Controller::addMenuPage */
        $this->wpAddAction(
            'network_admin_menu',
            'addMenuPage'
        );

        /** @see \VisualComposer\Modules\Settings\Controller::addSubmenuPages */
        $this->addEvent(
            'vcv:settings:mainPage:menuPageBuild',
            'addSubmenuPages'
        );
    }

    /**
     * Get main page slug.
     * This determines what page is opened when user clicks 'Visual Composer' in settings menu.
     * If user user has administrator privileges, 'General' page is opened, if not, 'About' is opened.
     *
     * @param \VisualComposer\Helpers\Access\CurrentUser $currentUserAccess
     *
     * @return string
     * @throws \Exception
     */
    public function getMainPageSlug(CurrentUser $currentUserAccess)
    {
        $hasAccess = $currentUserAccess->wpAll('edit_pages')->part('settings')->can('vcv-settings')->get();

        return $hasAccess ? 'vcv-settings' : 'vcv-about';
    }

    /**
     * @param \VisualComposer\Helpers\Url $urlHelper
     *
     * @throws \ReflectionException
     */
    protected function addMenuPage(Url $urlHelper)
    {
        if (!is_network_admin()) {
            /** @see \VisualComposer\Modules\Settings\Controller::getMainPageSlug */
            $slug = $this->call('getMainPageSlug');
            $title = __('Visual Composer ', 'vcwb');

            $iconUrl = $urlHelper->assetUrl('images/logo/16x16.png');

            add_menu_page($title, $title, 'edit_posts', $slug, null, $iconUrl, 76);

            vcevent('vcv:settings:mainPage:menuPageBuild', ['slug' => $slug]);
        }
    }

    /**
     * @param \VisualComposer\Helpers\Access\CurrentUser $currentUserAccess
     *
     * @throws \Exception
     */
    protected function addSubmenuPages(CurrentUser $currentUserAccess)
    {
        if (!$currentUserAccess->wpAll('edit_posts')->get()) {
            return;
        }

        $pages = $this->getPages();
        /** @see \VisualComposer\Modules\Settings\Controller::getMainPageSlug */
        $parentSlug = $this->call('getMainPageSlug');

        foreach ($pages as $page) {
            $hasAccess = $currentUserAccess->part('settings')->can($page['slug'] . '-tab')->get();

            if ($hasAccess) {
                add_submenu_page(
                    isset($page['hidePage']) && $page['hidePage'] ? null : $parentSlug,
                    $page['title'],
                    $page['title'],
                    isset($page['capability']) ? $page['capability'] : 'manage_options',
                    $page['slug'],
                    function () use ($page, $pages) {
                        /** @see \VisualComposer\Modules\Settings\Controller::renderPage */
                        // @codingStandardsIgnoreLine
                        echo $this->call('renderPage', ['page' => $page, 'pages' => $pages]);
                    }
                );
            }
        }

        vcevent('vcv:settings:pageSettingsBuild', ['pages' => $pages, 'parentSlug' => $parentSlug]);
    }

    /**
     * @param array $page
     * @param array $pages
     *
     * @return string
     */
    protected function renderPage($page, $pages)
    {
        $layout = 'standalone';

        // pages can define different layout, by setting 'layout' key/value.
        if (isset($page['layout'])) {
            $layout = $page['layout'];
        }
        /** @var \visualComposer\Modules\Settings\Traits\Page $controller */
        $controller = $page['controller'];

        return vcview(
            'settings/layouts/' . $layout,
            [
                'content' => $controller->render($page),
                'tabs' => $pages,
                'activeSlug' => $page['slug'],
                'page' => $page,
            ]
        );
    }

    /**
     * @deprecated
     * Init settings page.
     */
    protected function initAdmin()
    {
        foreach ($this->getPages() as $page) {
            do_action('vcv:settings:initAdmin:page:' . $page['slug']);
        }
    }

    /**
     * @return mixed
     */
    public function getPages()
    {
        if (is_null($this->pages)) {
            $this->pages = vcfilter('vcv:settings:getPages', []);
        }

        return $this->pages;
    }
}
