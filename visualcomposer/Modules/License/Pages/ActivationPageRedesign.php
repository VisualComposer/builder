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
use VisualComposer\Helpers\Url;
use VisualComposer\Modules\Settings\Traits\Page;

/**
 * Class ActivationPageRedesign
 * @package VisualComposer\Modules\License\Pages
 */
class ActivationPageRedesign extends Container implements Module
{
    use Page;
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
        $this->addEvent(
            'vcv:inited',
            function (Token $tokenHelper, Request $requestHelper) {
                if (!$tokenHelper->isSiteAuthorized()) {
                    /** @see \VisualComposer\Modules\License\Pages\ActivationPage::addPage */
                    $this->addFilter(
                        'vcv:settings:getPages',
                        'addPage',
                        20
                    );
                } elseif ($requestHelper->input('page') === $this->getSlug()) {
                    $aboutPage = vcapp('SettingsPagesAbout');
                    wp_redirect(admin_url('admin.php?page=' . rawurlencode($aboutPage->getSlug())));
                    exit;
                }

                $this->addFilter('vcv:license:variables', 'addActivationVariables');
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

        return $variables;
    }

    /**
     * Enqueue activations styles and scripts
     */
    protected function beforeRender()
    {
        wp_enqueue_script('vcv:wpactivation:script');
        wp_enqueue_style('vcv:wpactivation:style');
    }

    /**
     * @param array $pages
     * @param \VisualComposer\Helpers\Access\CurrentUser $currentUserAccessHelper
     * @param \VisualComposer\Helpers\Url $urlHelper
     *
     * @return array
     */
    protected function addPage($pages, CurrentUser $currentUserAccessHelper, Url $urlHelper)
    {
        if (!$currentUserAccessHelper->wpAll('manage_options')->get()) {
            return $pages;
        }
        wp_register_script(
            'vcv:wpactivation:script',
            $urlHelper->assetUrl('dist/wpactivation.bundle.js'),
            [],
            VCV_VERSION
        );
        wp_register_style(
            'vcv:wpactivation:style',
            $urlHelper->assetUrl('dist/wpactivation.bundle.css'),
            [],
            VCV_VERSION
        );

        $pages[] = [
            'slug' => $this->getSlug(),
            'title' => __('Activation', 'vcwb'),
            'showTab' => false,
            'layout' => 'standalone',
            'controller' => $this,
            'type' => vcvenv('VCV_ENV_ADDONS_ID') !== 'account' ? 'standalone' : 'default', // TODO: check
        ];

        return $pages;
    }
}
