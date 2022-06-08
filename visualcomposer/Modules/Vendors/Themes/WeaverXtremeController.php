<?php

namespace VisualComposer\Modules\Vendors\Themes;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Container\BindingResolutionException;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Modules\Editors\Settings\TitleController;

/**
 * Compatibility with "Weaver Xtreme" theme
 *
 * @link https://wordpress.org/themes/weaver-xtreme/
 */
class WeaverXtremeController extends Container implements Module
{
    use WpFiltersActions;

    /**
     * @var TitleController
     */
    protected $titleController;

    public function __construct()
    {
        if (get_option('stylesheet') !== 'weaver-xtreme') {
            return;
        }

        $this->titleController = vcapp('EditorsSettingsTitleController');
        $this->fixDisablePageTitleSetting();
    }

    /**
     * Fix "Disable the page title" setting.
     *
     * Disabling the page title setting doesn't work correctly because theme
     * relies on `fallback_cb` argument with {@see wp_nav_menu()} instead of
     * using the {@see has_nav_menu()} function.
     */
    protected function fixDisablePageTitleSetting()
    {
        // Move filter, added in TitleController, from `wp_nav_menu_args` to `wp_nav_menu_objects`.
        // `wp_nav_menu_objects` applied further in wp_nav_menu, after checking the `fallback_cb`.
        $this->wpRemoveFilter('wp_nav_menu_args', $this->titleController->removeTitleFilterClosure);
        add_filter('wp_nav_menu_objects', $this->titleController->removeTitleFilterClosure);

        // Special case: fallback_cb should be treated separately. By default, WordPress uses
        // `wp_page_menu` function as a fallback_cb, which triggers `wp_list_pages` function.
        add_filter('wp_list_pages_excludes', $this->titleController->removeTitleFilterClosure);
        add_filter('wp_list_pages', $this->titleController->addTitleFilterClosure);
    }
}
