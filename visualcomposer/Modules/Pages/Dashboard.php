<?php

namespace VisualComposer\Modules\Pages;

use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Framework\Container;
use VisualComposer\Helpers\Url;

/**
 * Class Dashboard.
 */
class Dashboard extends Container implements Module
{
    /**
     * About constructor.
     */
    public function __construct()
    {
        add_action(
            'admin_menu',
            function () {
                $slug = 'vcv-dashboard';
                $title = __('Visual Composer ', 'vc5');

                /** @var Url $urlHelper */
                $urlHelper = vchelper('Url');
                $iconUrl = $urlHelper->assetUrl('images/logo/16x16.png');

                add_menu_page($title, $title, 'exist', $slug, null, $iconUrl, 76);

                add_submenu_page(
                    'vcv-dashboard',
                    'Dashboard',
                    'Dashboard',
                    'manage_options',
                    'vcv-dashboard',
                    function () use ($urlHelper) {
                        $dashboardImage = $urlHelper->assetUrl('images/dashboard/dashboard.png');
                        $css = $urlHelper->assetUrl(
                            'styles/dashboard/dashboard.css'
                        );
                        wp_enqueue_style('vcv:pages:dashboard', $css);
                        //<link rel="stylesheet" id="about-css" href="$css" type="text/css" media="all">

                        $template = <<<HTML
<div class="vcv-dashboard">
    <div class="vcv-dashboard-header">
        <h1>Welcome to New Visual Composer</h1>
        <p>Congratulations! You have been invited to participate in an exclusive Visual Composer demo for developers. Within this demo you will be able to discover the process to create new content elements and preview them in Visual Composer editor.</p>
        <img src="$dashboardImage" />
    </div>
    <div class="vcv-dashboard-body wp-clearfix">
        <div class="vcv-part">
            <h2>Try New Visual Composer Editor</h2>
            <p>Check new Visual Composer editor and access your newly developed elements. Experience the speed and live editing mode.</p>
            <button class="button button-primary button-large">Open Editor</button>
        </div>
        <div class="vcv-part">
            <h2>Develop Content Elements</h2>
            <p>Access development environment to create new or adapt existing Visual Composer elements via online editor or upload mechanism.</p>
            <button class="button button-primary button-large">Create Element</button>
        </div>
        <div class="vcv-part">
            <h2>Guide and Examples</h2>
            <p>See examples of existing elements and read step by step tutorials which will help you get started instantly.</p>
            <button class="button button-primary button-large">See Examples</button>
        </div>
    </div>
</div>
HTML;
                        echo $template;
                    }
                );

                global $submenu;
                $submenu['vcv-dashboard'][] = [
                    'Build elements',
                    'manage_options',
                    'http://test.hubpen.visualcomposer.io/wp-login/254a8957e9603b280e82ddd612a568f7',
                ];
                $submenu['vcv-dashboard'][] = ['Documentation', 'manage_options', '/docs'];
                $submenu['vcv-dashboard'][] = ['Try editor', 'manage_options', '/edit'];
            }
        );

    }
}
