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
        $capability = 'edit_posts';
        $part = null;
        if (isset($page['capability'])) {
            $capability = $page['capability'];
        }

        if (isset($page['capabilityPart']) && vcvenv('VCV_ADDON_ROLE_MANAGER_ENABLED')) {
            $part = $page['capabilityPart'];
        }
        $currentUserAccess = vchelper('AccessCurrentUser');
        if (!empty($part)) {
            $hasAccess = $currentUserAccess->part($part)->checkState(true)->get();
        } else {
            // Fallback to default logic
            $hasAccess = $currentUserAccess->wpAll($capability)->get();
        }

        if ($hasAccess) {
            $globalsHelper = vchelper('Globals');
            $outputHelper = vchelper('Output');

            if (isset($page['external'])) {
                $submenuCopy = $globalsHelper->get('submenu');
                $submenuCopy[ $parentSlug ][] = [$page['title'], $capability, $page['external']];
                $globalsHelper->set('submenu', $submenuCopy);
            } else {
                $tabsHelper = vchelper('SettingsTabsRegistry');
                $tabsHelper->set(
                    array_merge(
                        [
                            'name' => isset($page['innerTitle']) ? $page['innerTitle'] : $page['title'],
                            'parent' => $parentSlug,
                            'isDashboardPage' => isset($page['isDashboardPage']) && $page['isDashboardPage'],
                            'hideTitle' => '',
                            'iconClass' => '',
                            'callback' => function () use ($page, $outputHelper) {
                                /** @see \VisualComposer\Modules\Settings\Traits\SubMenu::renderPage */
                                $outputHelper->printNotEscaped($this->call('renderContent', ['page' => $page]));
                            },
                        ],
                        $page
                    )
                );

                $mainPageSlug = vcapp(\VisualComposer\Modules\Settings\Pages\Settings::class)->getMainPageSlug();
                add_submenu_page(
                    isset($page['isDashboardPage']) && $page['isDashboardPage'] ? $mainPageSlug : $parentSlug,
                    $page['title'],
                    $page['title'],
                    !empty($part) ? 'edit_posts' : $capability,
                    $page['slug'],
                    function () use ($page, $outputHelper) {
                        /** @see \VisualComposer\Modules\Settings\Traits\SubMenu::renderPage::renderPage */
                        if (isset($page['isDashboardPage']) && $page['isDashboardPage']) {
                            $page['layout'] = 'dashboard-main-layout';
                        }

                        $outputHelper->printNotEscaped($this->call('renderPage', ['page' => $page]));
                    }
                );

                // After add_submenu_page called last index of $submenuCopy['vcv-settings'] will be recently added item
                // So we can adjust it to add extra-class to hide
                $extraClass = 'vcv-submenu--' . vchelper('Str')->slugify($page['slug']);
                $extraClass .= isset($page['isDashboardPage']) && $page['isDashboardPage'] ? ' vcv-submenu-dashboard-page' : '';
                if (isset($page['hideInWpMenu']) && $page['hideInWpMenu']) {
                    $extraClass .= ' vcv-ui-state--hidden';
                }
                $submenuCopy = $globalsHelper->get('submenu');
                $submenuCopy[ $mainPageSlug ][ count($submenuCopy[ $mainPageSlug ]) - 1 ][4] = $extraClass;
                $globalsHelper->set('submenu', $submenuCopy);
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
        $layout = 'dashboard-main-layout';

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
            'tabs' => $pages,
            'activeSlug' => $page['slug'],
            'slug' => $page['slug'],
            'page' => $page,
        ];

        return vcview('settings/layouts/' . $layout, $pageData);
    }

    /**
     * @param array $page
     * @param array $pages
     *
     * @return string
     */
    protected function renderContent($page, $pages)
    {
        $layout = 'dashboard-tab-content-standalone';

        // pages can define different layout, by setting 'layout' key/value.
        if (isset($page['layout'])) {
            $layout = $page['layout'];
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
