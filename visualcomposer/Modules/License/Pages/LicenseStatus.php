<?php

namespace VisualComposer\Modules\License\Pages;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\License;
use VisualComposer\Helpers\Request;
use VisualComposer\Modules\Settings\Traits\Page;
use VisualComposer\Modules\Settings\Traits\SubMenu;

/**
 * Class LicenseStatus
 * @package VisualComposer\Modules\License\Pages
 */
class LicenseStatus extends Container implements Module
{
    use Page;
    use SubMenu;
    use EventsFilters;
    use WpFiltersActions;

    /**
     * @var string
     */
    protected $slug = 'vcv-license';

    /**
     * @var string
     */
    protected $templatePath = 'license/pages/license';

    /**
     * LicenseStatus constructor.
     *
     * @param \VisualComposer\Helpers\License $licenseHelper
     */
    public function __construct(License $licenseHelper)
    {
        $this->wpAddAction(
            'admin_menu',
            function (License $licenseHelper, Request $requestHelper) {
                if (!vchelper('AccessCurrentUser')->wpAll('manage_options')->get()) {
                    return;
                }

                if ($licenseHelper->isAnyActivated()) {
                    $this->call('addPage');
                    $this->wpAddFilter('submenu_file', 'subMenuHighlight');
                    $this->addFilter('vcv:settings:tabs', 'addSettingsTab', 11);
                    $this->wpAddAction(
                        'in_admin_header',
                        'addCss'
                    );
                } elseif ($requestHelper->input('page') === $this->getSlug()) {
                    wp_redirect(admin_url('admin.php?page=vcv-getting-started'));
                    exit;
                }
            },
            70
        );
    }

    /**
     * @throws \Exception
     */
    protected function addPage()
    {
        $page = [
            'slug' => $this->getSlug(),
            'title' => $this->buttonTitle(),
            'layout' => 'settings-standalone-with-tabs',
            'showTab' => false,
            'capability' => 'manage_options',
        ];
        $this->addSubmenuPage($page);
    }

    /**
     * @param $tabs
     *
     * @return mixed
     */
    protected function addSettingsTab($tabs)
    {
        $tabs[ $this->slug ] = [
            'name' => __('License', 'visualcomposer'),
        ];

        return $tabs;
    }

    /**
     * @param $submenuFile
     *
     * @return string
     */
    protected function subMenuHighlight($submenuFile)
    {
        $screen = get_current_screen();
        if (strpos($screen->id, $this->slug)) {
            $submenuFile = 'vcv-settings';
        }

        return $submenuFile;
    }

    /**
     * @return string
     */
    protected function buttonTitle()
    {
        return sprintf(
            '<strong style="vertical-align: middle;font-weight:500;">%s</strong>',
            __('License', 'visualcomposer')
        );
    }

    /**
     *
     */
    protected function beforeRender()
    {
        $urlHelper = vchelper('Url');
        wp_register_script(
            'vcv:wpVcSettings:script',
            $urlHelper->to('public/dist/wpVcSettings.bundle.js'),
            ['vcv:assets:vendor:script'],
            VCV_VERSION
        );
        wp_register_style(
            'vcv:wpVcSettings:style',
            $urlHelper->to('public/dist/wpVcSettings.bundle.css'),
            [],
            VCV_VERSION
        );
        wp_enqueue_script('vcv:wpVcSettings:script');
        wp_enqueue_style('vcv:wpVcSettings:style');
        wp_enqueue_script('vcv:assets:runtime:script');
    }

    /**
     *
     */
    protected function addCss()
    {
        echo <<<CSS
<style>
    #adminmenu .wp-submenu a[href*='page=vcv-license'] {
        display: none;
    }
</style>
CSS;
    }
}
