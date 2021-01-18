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
use VisualComposer\Modules\Settings\Pages\Settings;

/**
 * Class GettingStarted
 * @package VisualComposer\Modules\License\Pages
 */
class GettingStarted extends Container implements Module
{
    use Page;
    use SubMenu;
    use EventsFilters;
    use WpFiltersActions;

    /**
     * @var string
     */
    protected $slug = 'vcv-getting-started';

    /**
     * GettingStarted constructor.
     */
    public function __construct()
    {
        // BC: For vcv-about page redirect
        $this->wpAddAction(
            'admin_menu',
            function (Request $requestHelper) {
                if ($requestHelper->input('page') === 'vcv-about') {
                    wp_redirect(admin_url('admin.php?page=vcv-getting-started'));
                    exit;
                }
            },
            11
        );
        $this->wpAddAction(
            'admin_menu',
            function () {
                if (!vchelper('AccessCurrentUser')->wpAll('edit_posts')->get()) {
                    return;
                }
                $this->call('addPage');
            },
            70
        );
        $this->addFilter('vcv:editor:variables', 'addVariables');
    }

    protected function addVariables($variables, $payload)
    {
        // Used in Tutorial Template to get back to WordPress
        $variables[] = [
            'key' => 'vcvGettingStartedUrl',
            'value' => set_url_scheme(admin_url('admin.php?page=vcv-getting-started')),
            'type' => 'variable',
        ];

        return $variables;
    }

    /**
     *
     */
    protected function beforeRender()
    {
        $urlHelper = vchelper('Url');
        wp_register_script(
            'vcv:wpUpdate:script',
            $urlHelper->to('public/dist/wpUpdate.bundle.js'),
            ['vcv:assets:vendor:script'],
            VCV_VERSION
        );
        wp_register_style(
            'vcv:wpVcSettings:style',
            $urlHelper->to('public/dist/wpVcSettings.bundle.css'),
            [],
            VCV_VERSION
        );
        wp_enqueue_script('vcv:wpUpdate:script');
        wp_enqueue_style('vcv:wpVcSettings:style');
        wp_enqueue_script('vcv:assets:runtime:script');
    }

    /**
     * @param \VisualComposer\Modules\Settings\Pages\Settings $settingsController
     *
     * @throws \Exception
     */
    protected function addPage(Settings $settingsController)
    {
        $page = [
            'slug' => $this->getSlug(),
            'title' => $this->buttonTitle(),
            'layout' => 'standalone',
            'showTab' => false,
            'capability' => 'edit_posts',
        ];
        $this->addSubmenuPage($page, $settingsController->getMainPageSlug());
    }

    /**
     * @return string
     */
    protected function buttonTitle()
    {
        return sprintf(
            '<strong style="vertical-align: middle;font-weight:500;">%s</strong>',
            __('Getting Started', 'visualcomposer')
        );
    }

    /**
     * @param $response
     *
     * @return string
     */
    protected function afterRender($response)
    {
        return $response . implode('', vcfilter('vcv:update:extraOutput', []));
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

        if (vchelper('Request')->input('screen', '') === 'license-options') {
            $customGettingStartedSlug = 'vcv-license-options';
        } else {
            $customGettingStartedSlug = $page['slug'];
        }

        return vcview(
            'settings/layouts/' . $layout,
            [
                'content' => $this->call('render', [$page]),
                'tabs' => $pages,
                'activeSlug' => $page['slug'],
                'slug' => $customGettingStartedSlug,
                'page' => $page,
            ]
        );
    }
}
