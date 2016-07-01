<?php

namespace VisualComposer\Modules\Settings;

//use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Data;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Url;
use VisualComposer\Helpers\Access\CurrentUser;
use VisualComposer\Modules\Settings\Pages\About;
use VisualComposer\Modules\Settings\Pages\General;
use VisualComposer\Framework\Container;
use VisualComposer\Modules\Settings\Traits\Page;

/**
 * Class Controller.
 */
class Controller extends Container/* implements Module*/
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
        $this->wpAddAction(
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
     * @param \VisualComposer\Modules\Settings\Pages\General $generalPage
     *
     * @return string
     * @throws \Exception
     */
    public function getMainPageSlug(
        CurrentUser $currentUserAccess,
        About $aboutPage,
        General $generalPage
    ) {
        // TODO: Fix \is_multisite() function same issue in js_composer.
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
     * @param \VisualComposer\Helpers\Url $urlHelper
     */
    private function addMenuPage(Url $urlHelper)
    {
        /** @see \VisualComposer\Modules\Settings\Controller::getMainPageSlug */
        $slug = $this->call('getMainPageSlug');
        $title = __('Visual Composer ', 'vc5');

        $iconUrl = $urlHelper->assetUrl('images/logo/16x16.png');

        add_menu_page($title, $title, 'exist', $slug, null, $iconUrl, 76);

        do_action('vcv:settings:mainPage:menuPageBuild', $slug);
    }

    /**
     * @param \VisualComposer\Helpers\Access\CurrentUser $currentUserAccess
     *
     * @throws \Exception
     */
    private function addSubmenuPages(CurrentUser $currentUserAccess)
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
                        echo $this->call('renderPage');
                    }
                );
            }
        }

        do_action('vcv:settings:pageSettingsBuild');
    }

    /**
     * @param Request $request
     * @param \VisualComposer\Helpers\Data $data
     *
     * @return string
     */
    private function renderPage(Request $request, Data $data)
    {
        $pageSlug = $request->input('page');
        $layout = $this->layout;

        $pages = $this->getPages();
        $page = $data->arraySearch($pages, 'slug', $pageSlug);
        if ($page) {
            // pages can define different layout, by setting 'layout' key/value.
            if (isset($page['layout'])) {
                $layout = $page['layout'];
            }
            /** @var Page $controller */
            $controller = $page['controller'];

            return vcview(
                'settings/layouts/' . $layout,
                [
                    'content' => $controller->render(),
                    'tabs' => $pages,
                    'activeSlug' => $page['slug'],
                ]
            );
        }

        return '';
    }

    /**
     * Init settings page.
     *
     * @param \VisualComposer\Helpers\Url $urlHelper
     */
    private function initAdmin(Url $urlHelper)
    {
        wp_register_script(
            VCV_PREFIX . 'scripts-settings',
            $urlHelper->assetUrl('scripts/dist/settings.min.js'),
            [],
            VCV_VERSION,
            true
        );
        wp_enqueue_style(
            VCV_PREFIX . 'styles-settings',
            $urlHelper->assetUrl('styles/dist/settings.min.css'),
            false,
            VCV_VERSION,
            false
        );
        wp_enqueue_script(VCV_PREFIX . 'scripts-settings');

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
