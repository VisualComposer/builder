<?php

namespace VisualComposer\Modules\Settings\Traits;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

/**
 * Trait SubMenu.
 */
trait SubMenu
{
    /**
     * @param $page
     * @param string $parentSlug
     *
     * @throws \Exception
     */
    protected function addSubmenuPage($page, $parentSlug = 'vcv-settings')
    {
        if (isset($page['capability'])) {
            $capability = $page['capability'];
        } else {
            $capability = 'edit_posts';
        }

        $currentUserAccess = vchelper('AccessCurrentUser');
        if (!$currentUserAccess->wpAll($capability)->get()) {
            return;
        }
        $hasAccess = $currentUserAccess->part('settings')->can($page['slug'] . '-tab')->get();

        if ($hasAccess) {
            global $submenu;

            if (isset($page['external'])) {
                $submenu[ $parentSlug ][] = [$page['title'], $capability, $page['external']];
            } else {
                if (isset($page['isDashboardPage']) && $page['isDashboardPage']) {
                    $tabsHelper = vchelper('SettingsTabsRegistry');
                    $tabsHelper->set(
                        $page['slug'],
                        [
                            'name' => isset($page['innerTitle']) ? $page['innerTitle'] : $page['title'],
                            'subTitle' => isset($page['subTitle']) ? $page['subTitle'] : '',
                            'capability' => $capability,
                            'parent' => $parentSlug,
                            'layout' => $page['layout'],
                            'isDashboardPage' => true,
                            'hideTitle' => (isset($page['hideTitle']) && $page['hideTitle']),
                            'iconClass' => isset($page['iconClass']) && $page['iconClass'] ? $page['iconClass'] : '',
                            'callback' => function () use ($page) {
                                if (isset($page['isPremiumTeaser']) && $page['isPremiumTeaser']) {
                                    $page['layout'] = 'dashboard-premium-teaser';
                                }

                                /** @see \VisualComposer\Modules\Settings\Traits\SubMenu::renderPage */
                                echo $this->call('renderPage', ['page' => $page]);
                            },
                        ]
                    );
                }

                add_submenu_page(
                    isset($page['isDashboardPage']) && $page['isDashboardPage'] ? 'vcv-settings' : $parentSlug,
                    $page['title'],
                    $page['title'],
                    $capability,
                    $page['slug'],
                    function () use ($page) {
                        /** @see \VisualComposer\Modules\Settings\Traits\SubMenu::renderPage::renderPage */
                        if (isset($page['isDashboardPage']) && $page['isDashboardPage']) {
                            $page['layout'] = 'dashboard-main-layout';
                        }

                        echo $this->call('renderPage', ['page' => $page]);
                    }
                );

                // After add_submenu_page called last index of $submenu['vcv-settings'] will be recently added item
                // So we can adjust it to add extra-class to hide
                if (isset($page['hideInWpMenu']) && $page['hideInWpMenu']) {
                    $submenu['vcv-settings'][ count($submenu['vcv-settings']) - 1 ][4] = 'vcv-ui-state--hidden';
                }
            }
        }
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

        if (isset($page['isDashboardPage']) && $page['isDashboardPage']) {
            add_action(
                'admin_head',
                function () {
                    remove_all_actions('admin_notices');
                },
                1
            );
        }

        $pageData = [
            'content' => $this->call('render', [$page]),
            'tabs' => $pages,
            'activeSlug' => $page['slug'],
            'slug' => $page['slug'],
            'page' => $page,
        ];

        return vcview('settings/layouts/' . $layout, $pageData);
    }
}
