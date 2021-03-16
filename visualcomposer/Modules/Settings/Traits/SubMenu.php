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
                        array_merge(
                            [
                                'name' => isset($page['innerTitle']) ? $page['innerTitle'] : $page['title'],
                                'capability' => $capability,
                                'parent' => $parentSlug,
                                'isDashboardPage' => true,
                                'hideTitle' => '',
                                'iconClass' => '',
                                'callback' => function () use ($page) {
                                    /** @see \VisualComposer\Modules\Settings\Traits\SubMenu::renderPage */
                                    echo $this->call('renderPage', ['page' => $page]);
                                },
                            ],
                            $page
                        )
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
                $extraClass = 'vcv-submenu--' . vchelper('Str')->slugify($page['slug']);
                $extraClass .= $page['isDashboardPage'] ? ' vcv-submenu-dashboard-page' : '';
                if (isset($page['hideInWpMenu']) && $page['hideInWpMenu']) {
                    $extraClass .= ' vcv-ui-state--hidden';
                }
                $submenu['vcv-settings'][ count($submenu['vcv-settings']) - 1 ][4] = $extraClass;
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
            wp_enqueue_style('vcv:wpVcSettings:style');
            wp_enqueue_script('vcv:wpVcSettings:script');
            wp_enqueue_script('vcv:assets:runtime:script');

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
