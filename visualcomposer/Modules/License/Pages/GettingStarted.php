<?php

namespace VisualComposer\Modules\License\Pages;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Options;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Helpers\Request;
use VisualComposer\Modules\Settings\Traits\Page;
use VisualComposer\Modules\Settings\Traits\SubMenu;

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
                    wp_safe_redirect(admin_url('admin.php?page=vcv-getting-started'));
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

        $this->addFilter('vcv:wp:dashboard:variables', 'addDashboardVariables');
    }

    protected function addDashboardVariables($variables, Options $optionsHelper, Request $requestHelper)
    {
        // Used in Tutorial Template to get back to WordPress
        $page = $requestHelper->input('page');
        if ($page === 'vcv-getting-started') {
            $variables[] = [
                'key' => 'vcvActivationSurveyUserReasonToUse',
                'value' => $optionsHelper->get('activation-survey-user-reason-to-use', false),
                'type' => 'variable',
            ];
        }

        return $variables;
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
     * Add actions before render.
     */
    protected function beforeRender()
    {
        wp_enqueue_script('vcv:wpUpdate:script');
        wp_enqueue_style('vcv:wpVcSettings:style');
        wp_enqueue_script('vcv:assets:runtime:script');
    }

    /**
     * @param \VisualComposer\Modules\Settings\Pages\Settings $settingsController
     *
     * @throws \Exception
     */
    protected function addPage()
    {
        $page = [
            'slug' => $this->getSlug(),
            'title' => __('Getting Started', 'visualcomposer'),
            'layout' => 'dashboard-tab-content-standalone',
            'showTab' => false,
            'capability' => 'edit_posts',
            'isDashboardPage' => true,
            'hideInWpMenu' => false,
            'hideTitle' => true,
            'iconClass' => 'vcv-ui-icon-dashboard-getting-started',
        ];
        $this->addSubmenuPage($page, false);
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
}
