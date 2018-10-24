<?php

namespace VisualComposer\Modules\Settings\Pages;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Token;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Modules\Settings\Traits\Page;
use VisualComposer\Modules\Settings\Traits\SubMenu;

/**
 * Class About.
 */
class About extends Container implements Module
{
    use Page;
    use SubMenu;
    use WpFiltersActions;
    use EventsFilters;

    /**
     * @var string
     */
    protected $slug = 'vcv-about';

    /**
     * @var string
     */
    protected $templatePath = 'account/partials/activation-layout';

    /**
     * About constructor.
     */
    public function __construct()
    {
        $this->wpAddAction(
            'admin_menu',
            function (Token $tokenHelper, Request $requestHelper) {
                if (!$tokenHelper->isSiteAuthorized()) {
                    if ($requestHelper->input('page') === $this->getSlug()) {
                        $activationPageModule = vcapp('LicensePagesActivationPage');
                        wp_redirect(admin_url('admin.php?page=' . rawurlencode($activationPageModule->getSlug())));
                        exit;
                    }
                } else {
                    /** @see \VisualComposer\Modules\Settings\Pages\About::addPage */
                    $this->call('addPage');
                }
            },
            11
        );
    }

    /**
     *
     */
    protected function beforeRender()
    {
        $bundleName = 'wpUpdateRedesign';
        if (!vcvenv('VCV_FT_ACTIVATION_REDESIGN')) {
            $bundleName = 'wpsettings';
        }
        $urlHelper = vchelper('Url');
        wp_register_script(
            'vcv:settings:script',
            $urlHelper->assetUrl('dist/'.$bundleName.'.bundle.js'),
            [],
            VCV_VERSION
        );
        wp_register_style(
            'vcv:settings:style',
            $urlHelper->assetUrl('dist/'.$bundleName.'.bundle.css'),
            [],
            VCV_VERSION
        );
        wp_enqueue_script('vcv:settings:script');
        wp_enqueue_style('vcv:settings:style');
        $this->addFilter('vcv:license:variables', 'addActivationVariables');
    }

    protected function addActivationVariables(
        $variables,
        Url $urlHelper,
        CurrentUser $currentUserAccessHelper,
        EditorPostType $editorPostTypeHelper
    ) {
        if ($currentUserAccessHelper->wpAll('edit_pages')->get() && $editorPostTypeHelper->isEditorEnabled('page')) {
            $variables[] = [
                'key' => 'VCV_CREATE_NEW_URL',
                'value' => vcfilter('vcv:about:postNewUrl', 'post-new.php?post_type=page&vcv-action=frontend'),
                'type' => 'constant',
            ];
            $variables[] = [
                'key' => 'VCV_CREATE_NEW_TEXT',
                'value' => __('Create new page', 'vcwb'),
                'type' => 'constant',
            ];
        } elseif ($currentUserAccessHelper->wpAll('edit_posts')->get()
            && $editorPostTypeHelper->isEditorEnabled(
                'post'
            )) {
            $variables[] = [
                'key' => 'VCV_CREATE_NEW_URL',
                'value' => vcfilter('vcv:about:postNewUrl', 'post-new.php?vcv-action=frontend'),
                'type' => 'constant',
            ];

            $variables[] = [
                'key' => 'VCV_CREATE_NEW_TEXT',
                'value' => __('Create new post', 'vcwb'),
                'type' => 'constant',
            ];
        }

        return $variables;
    }

    /**
     *
     */
    protected function addPage()
    {
        $page = [
            'slug' => $this->getSlug(),
            'title' => __('About', 'vcwb'),
            'layout' => 'standalone',
            'showTab' => false,
            'controller' => $this,
            'capability' => 'edit_posts',
        ];
        $this->addSubmenuPage($page);
    }

    public function getActivePage()
    {
        $licenseHelper = vchelper('License');
        if ($licenseHelper->isActivated()) {
            return 'last-go-premium';
        }

        return 'last';
    }
}
