<?php

namespace VisualComposer\Modules\License\Pages;

if (!defined('ABSPATH')) {
    header('Status: 403 Forbidden');
    header('HTTP/1.1 403 Forbidden');
    exit;
}

use VisualComposer\Framework\Container;
use VisualComposer\Framework\Illuminate\Support\Module;
use VisualComposer\Helpers\Access\CurrentUser;
use VisualComposer\Helpers\Access\EditorPostType;
use VisualComposer\Helpers\Request;
use VisualComposer\Helpers\Token;
use VisualComposer\Helpers\Traits\EventsFilters;
use VisualComposer\Helpers\Traits\WpFiltersActions;
use VisualComposer\Modules\Settings\Traits\Page;
use VisualComposer\Modules\Settings\Traits\SubMenu;

/**
 * Class ActivationPageRedesign
 * @package VisualComposer\Modules\License\Pages
 */
class ActivationPageRedesign extends Container implements Module
{
    use Page;
    use SubMenu;
    use WpFiltersActions;
    use EventsFilters;

    /**
     * @var string
     */
    protected $slug = 'vcv-activation';

    /**
     * @var string
     */
    protected $templatePath = 'license/activation/layout';

    /**
     * ActivationPage constructor.
     */
    public function __construct()
    {
        if (!vcvenv('VCV_FT_ACTIVATION_REDESIGN')) {
            return;
        }
        $this->wpAddAction(
            'admin_menu',
            function (Token $tokenHelper, Request $requestHelper) {
                if (!$tokenHelper->isSiteAuthorized()) {
                    /** @see \VisualComposer\Modules\License\Pages\ActivationPage::addPage */
                    $this->call('addPage');
                } elseif ($requestHelper->input('page') === $this->getSlug()) {
                    wp_redirect(admin_url('admin.php?page=vcv-about'));
                    exit;
                }
            }
        );
    }

    protected function addActivationVariables(
        $variables,
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
                'value' => __('Create a blank page', 'vcwb'),
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
                'value' => __('Create a blank post', 'vcwb'),
                'type' => 'constant',
            ];
        }
        $variables[] = [
            'key' => 'VCV_ACTIVATION_PREMIUM_URL',
            'value' => admin_url('admin.php?page=vcv-upgrade'),
            'type' => 'constant',
        ];


        return $variables;
    }

    /**
     * Enqueue activations styles and scripts
     */
    protected function beforeRender()
    {
        $urlHelper = vchelper('Url');
        wp_register_script(
            'vcv:wpActivationRedesign:script',
            $urlHelper->assetUrl('dist/wpActivationRedesign.bundle.js'),
            [],
            VCV_VERSION
        );
        wp_register_style(
            'vcv:wpActivationRedesign:style',
            $urlHelper->assetUrl('dist/wpActivationRedesign.bundle.css'),
            [],
            VCV_VERSION
        );
        wp_enqueue_script('vcv:wpActivationRedesign:script');
        wp_enqueue_style('vcv:wpActivationRedesign:style');
        $this->addFilter('vcv:license:variables', 'addActivationVariables');
    }

    /**
     * Register submenu page for vcv-activation
     * @throws \Exception
     */
    protected function addPage()
    {
        $page = [
            'slug' => $this->getSlug(),
            'title' => __('Activation', 'vcwb'),
            'showTab' => false,
            'layout' => 'standalone',
            'controller' => $this,
            'type' => vcvenv('VCV_ENV_ADDONS_ID') !== 'account' ? 'standalone' : 'default', // TODO: check
            'capability' => 'manage_options',
        ];
        $this->addSubmenuPage($page);
    }
}
