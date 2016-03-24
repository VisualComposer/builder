<?php

namespace VisualComposer\Modules\Settings;

use VisualComposer\Framework\Illuminate\Contracts\Events\Dispatcher;
use VisualComposer\Helpers\Generic\Request;
use VisualComposer\Helpers\Generic\Data;
use VisualComposer\Helpers\Generic\Url;
use VisualComposer\Helpers\Generic\Access\CurrentUser\Access as CurrentUserAccess;
use VisualComposer\Modules\Settings\Pages\About;
use VisualComposer\Modules\Settings\Pages\General;
use VisualComposer\Framework\Container;

/**
 * Class Controller
 * @package VisualComposer\Modules\Settings
 */
class Controller extends Container
{
    /**
     * @var null
     */
    protected $pages = null;
    /**
     * @var string
     */
    protected $optionGroup = 'vc-v-settings';
    /**
     * @var string
     */
    protected $pageSlug = 'vc-v-settings';
    /**
     * @var string
     */
    protected $layout = 'default';

    /**
     * @param Dispatcher $event
     */
    public function __construct(Dispatcher $event)
    {
        add_action(
            'admin_init',
            function () {
                /** @see \VisualComposer\Modules\Settings\Controller::initAdmin */
                $this->call('initAdmin');
            }
        );

        add_action(
            'admin_menu',
            function () {
                /** @see \VisualComposer\Modules\Settings\Controller::addMenuPage */
                return $this->call('addMenuPage');
            }
        );

        add_action(
            'network_admin_menu',
            function () {
                /** @see \VisualComposer\Modules\Settings\Controller::addMenuPage */
                return $this->call('addMenuPage');
            }
        );

        add_action(
            'vc:v:settings:mainPage:menuPageBuild',
            function () {
                /** @see \VisualComposer\Modules\Settings\Controller::addSubmenuPages */
                $this->call('addSubmenuPages');
            }
        );
    }

    /**
     * Get main page slug
     * This determines what page is opened when user clicks 'Visual Composer' in settings menu
     * If user user has administrator privileges, 'General' page is opened, if not, 'About' is opened
     *
     * @param \VisualComposer\Helpers\Generic\Access\CurrentUser\Access $currentUserAccess
     * @param \VisualComposer\Modules\Settings\Pages\About $aboutPage
     * @param \VisualComposer\Modules\Settings\Pages\General $generalPage
     * @return string
     * @throws \Exception
     */
    private function getMainPageSlug(
        CurrentUserAccess $currentUserAccess,
        About $aboutPage,
        General $generalPage
    ) {
        $hasAccess = !$currentUserAccess->wpAny('manage_options')->part('settings')->can($generalPage->getSlug())->get()
            || (is_multisite()
                && !is_main_site());

        if ($hasAccess) {
            return $aboutPage->getSlug();
        } else {
            return $generalPage->getSlug();
        }
    }

    /**
     * @param \VisualComposer\Helpers\Generic\Url $urlHelper
     */
    private function addMenuPage(Url $urlHelper)
    {
        /** @see \VisualComposer\Modules\Settings\Controller::getMainPageSlug */
        $slug = $this->call('getMainPageSlug');
        $title = __('Visual Composer ', 'vc5');

        $iconUrl = $urlHelper->assetUrl('images/logo/16x16.png');

        add_menu_page($title, $title, 'exist', $slug, null, $iconUrl, 76);

        do_action('vc:v:settings:mainPage:menuPageBuild', $slug);
    }

    /**
     * @param \VisualComposer\Helpers\Generic\Access\CurrentUser\Access $currentUserAccess
     * @throws \Exception
     */
    private function addSubmenuPages(CurrentUserAccess $currentUserAccess)
    {
        if (!$currentUserAccess->wpAny('manage_options')->get()) {
            return;
        }

        $pages = $this->getPages();
        /** @see \VisualComposer\Modules\Settings\Controller::getMainPageSlug */
        $parentSlug = $this->call('getMainPageSlug');

        foreach ($pages as $page) {
            $hasAccess = $currentUserAccess->part('settings')->can($page['slug'] . '-tab')->get();

            if ($hasAccess) {
                add_submenu_page(
                    $parentSlug,
                    $page['title'],
                    $page['title'],
                    'manage_options',
                    $page['slug'],
                    function () {
                        /** @see \VisualComposer\Modules\Settings\Controller::renderPage */
                        $this->call('renderPage');
                    }
                );
            }
        }

        do_action('vc:v:settings:pageSettingsBuild');
    }

    /**
     * @param Request $request
     * @param \VisualComposer\Helpers\Generic\Data $data
     */
    private function renderPage(Request $request, Data $data)
    {
        $pageSlug = $request->input('page');
        $layout = $this->layout;

        $pages = $this->getPages();
        $page = $data->arraySearch($pages, 'slug', $pageSlug);
        if ($page) {
            // pages can define different layout, by setting 'layout' key/value
            if (isset($page['layout'])) {
                $layout = $page['layout'];
            }
            vcview(
                'settings/layouts/' . $layout,
                [
                    'content' => $page['controller']->render(),
                    'tabs' => $pages,
                    'activeSlug' => $page['slug'],
                ]
            );
        }
    }

    /**
     * Init settings page
     * @param \VisualComposer\Helpers\Generic\Url $urlHelper
     */
    private function initAdmin(Url $urlHelper)
    {
        wp_register_script(
            VC_V_PREFIX . 'scripts-settings',
            $urlHelper->assetUrl('scripts/dist/settings.min.js'),
            [],
            VC_V_VERSION,
            true
        );
        wp_enqueue_style(
            VC_V_PREFIX . 'styles-settings',
            $urlHelper->assetUrl('styles/dist/settings.min.css'),
            false,
            VC_V_VERSION,
            false
        );
        wp_enqueue_script(VC_V_PREFIX . 'scripts-settings');

        foreach ($this->getPages() as $page) {
            do_action('vc:v:settings:initAdmin:page:' . $page['slug']);
        }
    }

    /**
     * @return mixed
     */
    public function getPages()
    {
        if (is_null($this->pages)) {
            $this->pages = apply_filters('vc:v:settings:getPages', []);
        }

        return $this->pages;
    }
}
