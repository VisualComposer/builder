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

                add_menu_page($title, $title, 'exist', $slug, null, $iconUrl, -10);
                $user = wp_get_current_user();
                $urlToEditor = 'http://test.hubpen.visualcomposer.io/wp-login/' . sha1($user->data->user_login);

                $examplesPage = $urlToEditor . '?redirect=examples';
                add_submenu_page(
                    'vcv-dashboard',
                    'Dashboard',
                    'Dashboard',
                    'edit_posts',
                    'vcv-dashboard',
                    function () use ($urlHelper, $urlToEditor, $examplesPage) {
                        $dashboardImage = $urlHelper->assetUrl('images/dashboard/dashboard.png');
                        $slackImage = $urlHelper->assetUrl('images/dashboard/slack.png');
                        $css = $urlHelper->assetUrl(
                            'styles/dashboard/dashboard.css'
                        );
                        wp_enqueue_style('vcv:pages:dashboard', $css);

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
            <a href="/edit" class="button button-primary button-large">Open Editor</a>
        </div>
        <div class="vcv-part">
            <h2>Develop Content Elements</h2>
            <p>Access development environment to create new or adapt existing Visual Composer elements via online editor or upload mechanism.</p>
            <a href="$urlToEditor" target="_blank" class="button button-primary button-large">Create Element</a>
        </div>
        <div class="vcv-part">
            <h2>Guide and Examples</h2>
            <p>See examples of existing elements and read step by step tutorials which will help you get started instantly.</p>
            <a href="$examplesPage" target="_blank" class="button button-primary button-large">See 
            Examples</a>
        </div>
    </div>
    <div class="vcv-dashboard-bottom">
        <p>Have questions or feedback? We are here to communicate with you at any point of your Visual Composer experience.</p>
        <a href="https://vcdevs.slack.com/messages/general/details/" target="_blank"><img src="$slackImage" /></a>
    </div>
</div>
HTML;
                        echo $template;
                    }
                );
                global $submenu;
                $submenu['vcv-dashboard'][] = [
                    'Create Element',
                    'edit_posts',
                    $urlToEditor,
                ];
                $submenu['vcv-dashboard'][] = ['See Examples', 'edit_posts', $examplesPage];
                $submenu['vcv-dashboard'][] = ['Open Editor', 'edit_posts', '/edit'];
            }
        );

    }
}
