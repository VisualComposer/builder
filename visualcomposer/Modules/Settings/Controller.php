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
use VisualComposer\Helpers\Assets;
use VisualComposer\Helpers\Data;
use VisualComposer\Helpers\Token;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Url;
use VisualComposer\Modules\Account\Pages\ActivationPage;
use VisualComposer\Modules\Settings\Pages\About;
use VisualComposer\Modules\Settings\Pages\PostTypes;
use VisualComposer\Modules\Settings\Traits\Page;

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

    /**
     * @var string
     */
    protected $layout = 'default';

    public function __construct()
    {
        /** @see \VisualComposer\Modules\Settings\Controller::initAdmin */
        $this->wpAddAction(
            'admin_init',
            'initAdmin'
        );

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
     * @param \VisualComposer\Modules\Settings\Pages\About $aboutPage
     * @param \VisualComposer\Modules\Settings\Pages\PostTypes $postTypes
     * @param \VisualComposer\Modules\Account\Pages\ActivationPage $activationPage
     * @param \VisualComposer\Helpers\Token $tokenHelper
     *
     * @return string
     * @throws \Exception
     */
    public function getMainPageSlug(
        CurrentUser $currentUserAccess,
        About $aboutPage,
        PostTypes $postTypes,
        ActivationPage $activationPage,
        Token $tokenHelper
    ) {
        $hasAccess = !$currentUserAccess->wpAll('manage_options')->part('settings')->can($postTypes->getSlug())->get();

        if ($hasAccess) {
            return $aboutPage->getSlug();
        } else {
            return $tokenHelper->isSiteAuthorized() ? $postTypes->getSlug() : $activationPage->getSlug();
        }
    }

    /**
     * @param \VisualComposer\Helpers\Url $urlHelper
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
     * @param \VisualComposer\Helpers\Data $data
     *
     * @return string
     */
    protected function renderPage($page, $pages, Data $data)
    {
        $layout = $this->layout;

        wp_enqueue_script('vcv:settings:script');
        wp_enqueue_style('vcv:settings:style');
        // pages can define different layout, by setting 'layout' key/value.
        if (isset($page['layout'])) {
            $layout = $page['layout'];
        }
        /** @var Page $controller */
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
     * Init settings page.
     *
     * @param \VisualComposer\Helpers\Url $urlHelper
     */
    protected function initAdmin(Url $urlHelper, Assets $assetsHelper)
    {
        // TODO: Set versions for assets
        if (vcvenv('VCV_ENV_EXTENSION_DOWNLOAD___!!!!')) {
            wp_register_script(
                'vcv:settings:script',
                $assetsHelper->getAssetUrl('/editor/wpsettings.bundle.js'),
                [],
                VCV_VERSION
            );
            wp_register_style(
                'vcv:settings:style',
                $assetsHelper->getAssetUrl('/editor/wpsettings.bundle.css'),
                [],
                VCV_VERSION
            );
        } else {
            wp_register_script(
                'vcv:settings:script',
                $urlHelper->assetUrl('dist/wpsettings.bundle.js'),
                [],
                VCV_VERSION
            );
            wp_register_style(
                'vcv:settings:style',
                $urlHelper->assetUrl('dist/wpsettings.bundle.css'),
                [],
                VCV_VERSION
            );
        }

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
